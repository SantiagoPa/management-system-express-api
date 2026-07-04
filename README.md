
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
