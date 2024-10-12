# Node-ambassador

## Instalar dependencias

```terminal
npm install
```

## Levantar el servidor

```terminal
docker-compose up -d
```

## Correr los seeds

```terminal
docker-compose exec -it backend bash
npm run seed:ambassadors
npm run seed:products
npm run seed:links
npm run seed:orders
npm run update:rankings
```
