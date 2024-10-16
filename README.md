# Node-ambassador

## Instalar dependencias

```terminal
npm install
```

## Levantar el servidor

```terminal
docker-compose up -d --build
```

## Correr los seeds

Primero ejecutar este comando:

```terminal
docker-compose exec -it backend bash
```

Luego ejecutar estos comandos:

```
npm run seed:ambassadors
npm run seed:products
npm run seed:links
npm run seed:orders
npm run update:rankings
```
