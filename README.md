
# SISTEMA DE GESTION DE INVENTARIOS

## Pasos para ejecutar la api de manera local

## DEV

- clonar el repositorio: `git clone https://github.com/SantiagoPa/management-system-express-api.git`
- instalar dependencias con pnpm.
    - si no tienes pnpm hay que instalarlo `npm i -g pnpm` o visita la pagina oficial para instalar [pnpm - click aqui](https://pnpm.io/es/installation)
    - ejecutar `pnpm install`
- requisito tener docker ya sea docker desktop o el engine de docker
    - [instalar docker aqui](https://www.docker.com/get-started/) y [docker-compose aqui](https://docs.docker.com/compose/install/)
    - ejecutar en consola `docker compose up --build -d` para levantar y correr una imagen postgres
- ejecutar `pnpm run dev` para levantar el proyecto

## Extructura del proyecto

```
management-system-express-api/
├── .env.template
├── .gitignore
├── README.md
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prisma.config.ts
├── tsconfig.build.json
├── tsconfig.json
├── vitest.config.ts
├── setupTests.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── 20260703221831_init/
│       ├── 20260703222216_map_name/
│       ├── 20260704082217_update_product_sku/
│       ├── 20260704083437_product_history/
│       ├── 20260704160532_alert_and_purchases_orders/
│       ├── 20260704160748_mappers_alert_orders/
│       ├── 20260704164000_relation_product_alert/
│       ├── 20260704170940_dates_alerts_orders/
│       ├── 20260704175127_alert_one_product/
│       ├── 20260704202346_add_motivo_order/
│       ├── 20260705004451_delete_cascade/
│       ├── 20260705004743_active_field_product/
│       ├── 20260705005123_sku_unique_product/
│       ├── 20260705052225_one_to_many_product_alert/
│       ├── 20260705061759_add_type_catgory_in_product/
│       └── migration_lock.toml
│
├── public/
│   └── index.html
│
└── src/
    ├── app.ts
    │
    ├── config/
    │   └── envs.ts
    │
    ├── data/
    │   └── const/
    │       └── seed_products.ts
    │
    ├── domain/                         # Capa de dominio (Clean Architecture)
    │   ├── datasource/
    │   │   ├── alert.datasource.ts
    │   │   ├── order.datasource.ts
    │   │   └── product.datasource.ts
    │   ├── dtos/
    │   │   ├── alert/filter-alert.dto.ts
    │   │   ├── order/
    │   │   │   ├── create-order.dto.ts
    │   │   │   └── update-status-order.dto.ts
    │   │   ├── products/
    │   │   │   ├── create-product.dto.ts
    │   │   │   ├── filter-product.dto.ts
    │   │   │   └── update-amount-prodcut.dto.ts
    │   │   └── index.ts
    │   ├── entities/
    │   │   ├── alert.entity.ts
    │   │   ├── order.entity.ts
    │   │   ├── product-extended.entity.ts
    │   │   ├── product-history.entity.ts
    │   │   └── product.entity.ts
    │   ├── error/
    │   │   └── custom-error.ts
    │   ├── repositories/
    │   │   ├── alert.repository.ts
    │   │   ├── order.repository.ts
    │   │   └── product.repository.ts
    │   ├── use-cases/
    │   │   ├── alert/get-alerts.ts
    │   │   ├── order/
    │   │   │   ├── create-order.ts
    │   │   │   └── update-status-order.ts
    │   │   └── products/
    │   │       ├── create-product.ts
    │   │       ├── get-product.ts
    │   │       ├── get-products.ts
    │   │       ├── seed-products.ts
    │   │       └── update-amount-product.ts
    │   └── index.ts
    │
    ├── infrastructure/                 # Implementaciones concretas
    │   ├── datasource/
    │   │   ├── alert.datasource.impl.ts
    │   │   ├── order.datasource.impl.ts
    │   │   └── product.datasource.impl.ts
    │   └── repositories/
    │       ├── alert.repository.impl.ts
    │       ├── order.repository.impl.ts
    │       └── product.repository.impl.ts
    │
    ├── presentation/                   # Controladores y rutas (Express)
    │   ├── alert/
    │   │   ├── controller.ts
    │   │   └── routes.ts
    │   ├── order/
    │   │   ├── controller.ts
    │   │   └── routes.ts
    │   ├── products/
    │   │   ├── controller.ts
    │   │   └── routes.ts
    │   ├── routes.ts
    │   └── server.ts
    │
    ├── types/
    │   └── error-zod.type.ts
    │
    └── utils/
        └── formatErrrorsSchemasZod.ts
```
