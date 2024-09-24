# typesense-repro

Set up

Start Typesense
```sh
docker-compose up -d
```

Install packages
```sh
yarn install
```
Run migration
```sh
cd infra/typesense
yarn migrate
```

Run server and hit endpoint to test importing
```sh
cd my-app
yarn dev
curl localhost:3000
```
