import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { Order } from "../entity/order.entity";
import { Link } from "../entity/link.entity";
import { Product } from "../entity/product.entity";
import { OrderItem } from "../entity/order-item.entity";
import Stripe from "stripe";
import { redisClient } from "../index";
import { kafkaProducer } from "../kafka/config";

export const Orders = async (req: Request, res: Response) => {
  const orders = await getRepository(Order).find({
    where: { complete: true },
    relations: ["order_items"],
  });

  res.send(
    orders.map((order: Order) => ({
      id: order.id,
      name: order.name,
      email: order.email,
      total: order.total,
      created_at: order.created_at,
      order_items: order.order_items,
    }))
  );
};

export const CreateOrder = async (req: Request, res: Response) => {
  const body = req.body;

  const link = await getRepository(Link).findOne({
    where: { code: body.code },
  });

  if (!link) {
    return res.status(400).send({
      message: "Invalid link!",
    });
  }

  const queryRunner = getConnection().createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let order = new Order();
    order.user_id = link.user_id;
    order.ambassador_email = body.email;
    order.code = body.code;
    order.first_name = body.first_name;
    order.last_name = body.last_name;
    order.email = body.email;
    order.address = body.address;
    order.country = body.country;
    order.city = body.city;
    order.zip = body.zip;

    order = await queryRunner.manager.save(order);

    const lineItems = [];

    for (let p of body.products) {
      const product = await getRepository(Product).findOne(p.product_id);

      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.product_title = product.title;
      orderItem.price = product.price;
      orderItem.quantity = p.quantity;
      orderItem.ambassador_revenue = 0.1 * product.price * p.quantity;
      orderItem.admin_revenue = 0.9 * product.price * p.quantity;

      await queryRunner.manager.save(orderItem);

      lineItems.push({
        name: product.title,
        description: product.description,
        images: [product.image],
        amount: 100 * product.price,
        currency: "usd",
        quantity: p.quantity,
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: "2020-08-27",
    });

    const source = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CHECKOUT_URL}/error`,
    });

    order.transaction_id = source["id"];
    await queryRunner.manager.save(order);

    await queryRunner.commitTransaction();

    res.send(source);
  } catch (e) {
    await queryRunner.rollbackTransaction();

    return res.status(400).send({
      message: "Error occurred!",
    });
  }
};

export const ConfirmOrder = async (req: Request, res: Response) => {
  const repository = getRepository(Order);

  const order = await repository.findOne({
    where: {
      transaction_id: req.body.source,
    },
    relations: ["order_items"],
  });

  if (!order) {
    return res.status(404).send({
      message: "Order not found!",
    });
  }

  await repository.update(order.id, { complete: true });

  await redisClient.zIncrBy(
    "rankings",
    order.ambassador_revenue,
    `${order.first_name} ${order.last_name}`
  );

  const value = JSON.stringify({
    ...order,
    admin_revenue: order.total,
    ambassador_revenue: order.ambassador_revenue,
  });

  await kafkaProducer.send({ topic: "default", messages: [{ value }] });

  res.send({
    message: "success",
  });
};

export const GetAmbassadorRevenue = async (req: Request, res: Response) => {
  const userId = req["user_id"];
  const ordersRepository = getRepository(Order);
  const orders = await ordersRepository.find({
    where: {
      user_id: userId,
      complete: true,
    },
    relations: ["order_items"],
  });
  const revenue = orders.reduce((s, o) => s + o.ambassador_revenue, 0);
  res.send({ revenue });
};
