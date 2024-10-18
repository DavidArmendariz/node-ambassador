import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  link_code: string;

  @Column("decimal")
  ambassador_revenue: number;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
