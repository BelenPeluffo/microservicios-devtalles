## Sección 4 - Products Microservice

### 1- Creación de proyecto

Existen por lo menos dos formas de crear los microservicios que implementaremos y de relacionarlos.

1. `nest g app <nombre-microservicio>` por cada microservicio que queramos. Ésto creará cada uno dentro de la carpeta `app` del proyecto creado
2. crear dentro de una misma carpeta cuatro apps distintas y separadas, es decir que ejecutaremos cuatro veces el comando de siempre para crear apps -> **éste es el approach que tomaremos**.

### 4- Inicio de microservicio - `Products`

Este primer servicio lo vamos a crear primero implementado una API REST, para familiarizarnos con los nuevos conceptos de microservicios.

1. Eliminamos el controller y su test, y el service de `app`.
2. Creamos recurso products: `nest g res products --no-spec`.

### 5- Entidad y DTOs

El microservicio se va a encargar solamente de la entidad `Products`.

1. Definimos las propiedades de `product.entity.ts` y `create-product.dto.ts`.
2. Instalamos class-validator y class-transformer
3. Definimos los decoradores para el DTO de creación de productos
4. Definir el `app.useGlobalPipes` para que tome las validaciones de los decoradores y no deje que se le mande a cada EP más que las propiedades definidas.
5. Definimos los types de las propiedades de los DTOs para que realice la transformación de los valores obtenidos.

### 6- Configuración de variables de entorno

1. Crear el /config/envs.ts y el /.env.
2. Instalamos `dotenv` y `joi`.
3. Creamos las variables, las tipamos y exportamos (en este caso, yo exporté las variables de entorno en el objeto `config`)

   > Es **muy necesario** que hagamos `import 'dotenv/config'` porque si no, no va a leernos las variables de entorno!

4. Creamos un `/config/index.ts` para exportar todo lo que se encuentre en `envs.ts`.
5. Modificamos `main.ts` para tomar el puerto desde el `config`

### 7- Prisma & SQLite

`prisma` es equivalente a `TypeORM` y `sequelize`.

1. Instalar prisma: `yarn add --dev prisma`
2. Inicializamos prisma en nuestro proyecto: `npx prisma` y luego `npx prisma init`

   Ésto modificará nuestro `.env`, agregando una `DATABASE_URL`

3. Actualizaremos el `scheme.prisma` en base al recipe que provee la docu oficial de NestJSpara definir el modelo `Product` de la DB

   > ES IMPERIOSO que se elimine la propiedad `output` que se crea por defecto en el `client`.

   > Hacer ésto equivale a usar las entities en `TypeORM` o a definir los modelos en `sequelize`

   > Podemos instalar la extensión `Prisma` para habilitar el syntax highlighting en los archivos `.prisma`.

4. Actualizamos el `envs.ts` para que tenga presente la nueva variable de entorno `DATABASE_URL`.
5. Instalar el `@prisma/client`, que es lo que nos permitirá trabajar con la DB.
6. Ejecutaremos la migración `npx prisma migrate dev --name init`, que creará la DB en función a cómo tenemos definido el schema
   > Ésto crea el `dev.db` que definimos como valor en el `.env.DATABASE_URL`.
7. Ejecutemos `npx prisma generate` para generar el cliente y evitar que rompa la app.
8. Actualizamos nuestro `ProductsService` para que extienda de `PrismaClient` e implemente `OnModuleInit`. Implementamos el método `onModuleInit() de forma que se connecte a la DB.
9. Implementamos el logger en `ProductService`: creamos una instancia de logger y usamos éso en vez de `console.log` en el `onModuleInit()`.
10. Hacemos lo mismo en el `main`.

### 8- Insertar y comprobar la base de datos

1. Actualizamos el método de creación de productos para que haga la inserción en la DB.

   Lo hacemos mediante `this.<entidad>.create({ data: <DTO> })` donde `<entidad>` es el nombre que definimos como nombre del modelo en `schema.prisma`. Como en nuestro caso definimos `model Product`, deberemos hacer `this.product.create()`.

   > Para poder abrir la DB, simplemente desde DBeaver hacemos Archivo > Buscar archivo denominado > filtrar por \*.db y abrir el archivo. Ahí se abrirá una conexión nueva dentro de la carpeta `File databases`.

2. Creamos un `seed.sql` que contiene un insert para crear 50 productos.

### 9- Obtener productos y paginarlos

1. Actualizar el `ProductsService.findAll()`.
2. Crear DTO de paginación.

   > `limit` y `page` no deben definirse con el operador opcional de TypeScript porque como ya definimos que su valor por defecto será `10` y `1` respectivamente, en la realidad siempre tendrá definido un valor. Además, hace fallar la app.

3. Creamos un `index` dentro de la carpeta `common`.
4. Agregamos al `ProductsController.findAll` el decorador `@Query` con el PaginationDTO.

### 10- Paginar mediante Prisma

1. Actualizamos la firma del `ProductsService.findAll()` para que tome el pagination DTO y actualizamos el objeto de configuración del `findMany`.
2. Calcular el total de registros.
3. Calcular la última página.
4. Actualizar el return del `ProductsService.findAll()` para que devuelva `data` y `meta`, donde irán los productos, por un lado, y los datos de paginación, por el otro.

### 11- Retornar producto por ID

1. Actualizamos `ProductsService.findOne()` para que retorne el resultado de hacer `findUnique()`.

   > También se puede usar el `findFirst()`.

2. Implementar manejo de error si no existe el producto con el ID provisto.

### 12- Actualizar producto

1. Actualizamos el `ProductsController.update()` para que tome el ID y para que gestione el error si no existiera un producto con el ID que se le proveyó.

### 13- Eliminar un producto

1. Implementamos el método de HARD delete en `ProductsService.delete()`.

### 14- Soft delete

1. Agregamos la flag `available` en el model de Product en `schema.prisma` donde almacenaremos un booleano que determinará el estado de actividad de los registros.
2. Corremos una migración para generar el cambio en la tabla: `npx prisma migrate dev --name add-available-column-to-product-table`
3. Corremos `npx prisma generate` para que se actualicen los types en el cliente de Prisma.
4. Actualizar `findAll` y `findOne` para tener en consideración que los registros entre los que buscar deben ser aquellos con el `available: true`.
5. Crear un índice para el `available` porque va a usarse en varias queries: `@@index([available])`.
6. Corremos una nueva migración

### 15- Transformar a microservicio

Podríamos simplemente convertir nuestra api REST mediante el uso, en `main.ts`, de `app.startAllMicroservices()` pero éso provocaría que nuestra app se siga comportando como REST y realice las comunicaciones usando el protocolo HTTP, siendo un híbrido entre REST y microservicio. Nosotrxs, por el contrario, queremos usar el protocolo TCP.

> [Documentación de NestJS sobre microservicios](https://docs.nestjs.com/microservices/basics)

1. `yarn add @nestjs/microservices`
2. Modificar el método del `NestFactory` a usar en el `main.ts`

### 16- Message Patterns

1. Actualizamos el controller

   1. Eliminar los decoradores HTML y agregándole a cada uno el `@MessagePattern`

   2. Lo que reciba el POST no vendrá más en `@Body` sino en `@Payload`; lo mismo con los `@Query` de los demás métodos

      > Siguen aplicando las validaciones definidas para los DTOs con `class-validator`

   3. Actualizamos el DTO de actualización. Ésto es debido a que como no hay más diferencia entre `Query`, `Param` y `Body`, porque todos son reemplazados por `Payload`, sólo se puede definir un elemento y por lo tanto el `:id` que llegaba en el parámetro debe ser agregado en el DTO.

## Sección 5 - Gateway

El gateway sirve para conectar los request del user con los EPs necesarios del microservicio, entre otras cosas. Ésto quiere decir que no tiene más que lógica de redirección, nada que ver con la base de datos.

### 3- ClientGateway

Creamos el microservicio de gateway en el directorio `/gateway`.

Como en el [inicio de la sección 4](#1--creación-de-proyecto), hay que eliminar los controllers y servicios del `app` y las importaciones en el módulo y en el `main.ts`.

### 4- Rutas y variables de entorno

Como nosotrxs tenemos que seguir pudiendo acceder a través de HTTP a los EPs que ya definimos, tenemos que realizar una serie de implementaciones en nuestro gateway para que tome las peticiones HTTP y haga las peticiones TCP correspondientes a los distintos EPs.

1. Copiamos lo que teníamos en `/02-products-app/products/src/config/envs.ts` y lo pegamos en el nuevo `.env` del gateway.
2. Instalamos las dependencias necesarias (joi y dotenv).
3. Creamos otro recurso también llamado productos: `nest g res products`, que es el que se encargará de comunicarse con el microservicio `/02-products-app/products`.
   > Debo seleccionar para que me cree una API REST y que no me cree los EPs CRUD ni otras cosas.

### 5- Levantar Products Microservice y conectarlo al Gateway

1. Instalamos el `@nestjs/microservices` en el `gateway`
2. En `ProductsModule` agregamos a imports el `ClientsModule.register()`

   > Tenemos que definir el mismo tipo de transporte que el definido en el microservicio. Ésto lo vemos en `/02-products-app/products/src/main.ts`.

3. Creamos constantes que almacenen el nombre de módulo a registrar en `/02-products-app/gateway/src/config/service.ts`.
4. Agregar a la definición del `ClientModule` las opciones con el HOST y el PORT
5. Actualizar el `.env` con variables donde se guarden HOST y PORT
6. Actualizar `envs.ts` con la definición de ambas: `EnvVars`, `envSchema` y `config`

### 6- Obtener todos los productos

1. Inyectamos el microservicio en el controller del gateway relacionado a ese servicio usando `@Inject(KEY_DEL_MS)` y definimos la variable privada `productService`
2. Comenzamos a implementar los métodos del microservicio en el controller del gateway.

   > `send()` espera una respuesta; `emit()` no.

   Los parámetros que toma el `send` son el objeto o string que hayamos definido en el controller del microservicio (en nuestro caso, fue { cmd: key }) y el segundo parámetro es un objeto que representa el payload.

### 7- Paginar resultados y enviar payload

1. Instalar `class-transformer` y `class-validator`
2. Copiar `./products/src/common` a `./gateway/src`
3. Implementar el useGlobalPipes en el `./gateway/src/main.ts`
4. Actualizamos `findAll()` para que de parámetro tome el `@Query` y el DTO correspondiente y actualizamos la instancia de `send()` para pasarle por como segundo argumento al DTO

### 8- Manejo de excepciones

1. Implementamos el `send()` para el GET por ID. Como argumento de payload tenemos que pasar exactamente la estructura que hayamos definido en el controller del MS

   En este caso, el `@Payload` que espera el ID es literalmente un solo valor, entonces el segundo argumento del `send()` será `id`.

2. Implementamos una instancia de `RpcException` para definir errores en el controller service del microservicio
   > Ésto nos permitirá tener logs más concisos y con un color scheme correspondiente.
   > Lo que se le pase como argumento a la `RcpException` en el MS será devuelto así a la API que lo contacte.
3. Implementamos en el controller del gateway un try-catch donde el catch va a devolver el error que nos devuelve el MS como un `BadRequestError`.

### 9- Microservice Exception Filter

1. Creamos `/exceptions/rpc-exception.filter.ts` y ahí definimos la `ExceptionFilter` en función de lo indicado en [la docu de NestJS](https://docs.nestjs.com/microservices/exception-filters).

   > Agregarlo al barrel export de `gateway/src/common/index.ts`.

2. Implementamos en `gateway/src/main.ts` el `app.useGlobalFilters()` pasándole como argumento una nueva instancia del filter que acabamos de crear.
3. Modificamos el tipo de error a levantar en el controller del gateway para que cree una nueva instancia de `RcpException` en vez de un error genérico.
   > Definimos que cree una instancia de `RcpException` porque es esta clase la que definimos en el decorador `@Catch` del filtro que creamos. Así es como la app sabe que tiene que capturarla.

### 10- Implementar el RpcCustomExceptionFilter

1. Cambiamos la clase a implementar a un `ExceptionFilter` y borramos el return type del `catch` en el filte del filtro que creamos
2. Implementamos el `context`
3. Almacenamos la respuesta del error en `response`
4. Almacenamos el error que nos devuelve el MS en `error`
5. Creamos un bloque condicional para mandar el mensaje recibido de MS
6. Creamos un bloque fuera del condicional para errores no contemplados
7. En el MS actualizamos la estructura del argumento del `RcpException` para que sea `{ status, message }`.
   > Otra forma de hacer el cacth de los errores de RCP es usando `.pipe(catchError(error => throw new RcpException(error)))` como se ve en el método del update

### 11- Implementar métodos faltantes

1. Copiamos `products/src/products/dto` hacia `gateway/src/products` para tener disponibilizados los DTOs de creación y actualización
2. Para el método de actualización, agregamos el Pipe para convertir el ID en número
3. Eliminamos del DTO de actualización la prop ID porque en este servicio no lo necesitamos (en contraste al MS).

## Sección 6 - Orders Microservice

### 3- Inicio de proyecto

Será el encabezado de las órdenes y no el detalle, que irá a otro MS (`/02-products-app/orders`).

1. Iniciamos el proyecto en su carpeta correspondiente: `nest new .`
2. Setteamos las variables de entorno para levantar la app en el puertp `3002`
   1. Instalar `joi` y `dotenv`
   2. Importar `dotenv` en el archivo
   3. Crear interfaz y esquema de las variables de entorno
   4. Implementar instancia de `validate()` de joi
   5. Tipar el `value` devuelto en la instancia con la interfaz creada
   6. Crear `config` con una propiedad por cada variable
   7. Asignar en `main.ts` al `listen()` el `config.PORT`
3. Borrar todos los archivos del `src` con exceptión del `.module`

### 4- Configurar OrdersMicroservice

1. Instalamos el `@nestjs/microservices`
2. Actualizamos el método de `NestFactory` para crear el microservicio.
3. Corremos `nest g res orders --no-spec`: elegimos `Microservice (non-HTTP)` y luego le decimos que sí a que nos cree un CRUD
   Ésto crea una carpeta con el nombre `orders` y dentro crea un controller, un service y un module.

### 5- Conectar Gateway con OrdersMicroservice

1. En el gateway, correr `nest g res orders --no-spec` y crear una API y CRUD.
2. Borrar el servicio y borrar tudas sus referencias.
3. Crear una key en `gateway/src/config/service.ts`
4. Modificamos el `orders.controller.ts` para inyectar el microservicio en conjunto con el `ClientProxy`

   > Recordemos que es ULTRA necesario que estemos atentos a la forma en que se definió la key para cada EP del microservice, porque si en éste se definieron como simples strings pero después en el controller del gateway estamos queriendo definir la key en su versión de objeto (`{ cmd: key}`), no va a establecerse la conexión con ninguno de los EPs del MS.

5. Actualizamos el módulo `gateway/src/orders/orders.module.ts` para importar el `ClientsModule` con los datos de hosting del mircoservicio
6. Actualizamos el `config` de variables de entorno para definir el host y el puerto para el nuevo MS al que haremos referencia en el archivo anterior

### 6- Docker - Levantar PostgreSQL

> [Sitio en que tenés disponible una DB gratis de postgreSQL](https://neon.tech)

1. Crearnos en `orders/` el archivo `docker-compose.yaml`
   ```yaml
   version: "3"
   services:
      # Nombre del servicio
      orders-db:
         container_name: orders-db
         image: postgres:16.2
         # Cada vez que se levante docker desktop se levantará esta imagen
         restart: always
         volumes:
            # Carpeta en nuestro proyecto:path en el contenedor donde se guarda la data (que podemos determinar cuál es en la docu oficial de docker)
            # Ésto permitirá que si se destruye el contenedor, no se pierda la data.
            - ./postgres:/var/lib/postgresql/data
         ports:
            # Puerto de mi PC:Puerto del contenedor
            # Sólo a través de ese puerto podré acceder a la DB
            - 5432:5432
         environment:
            # Definimos las variables de entorno
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=123456
            - POSTGRES_DB=orders_db
   ```
2. En el directorio donde esté el `.yaml`, ejecutamos `docker compose up -d`
   > `compose` quiere decir que se levantará el contenedor en base a las indicaciones del archivo `docker-compose` que por defecto infiere que está en el directorio raíz.
   
   > `-d` es para que podamos cerrar la terminal sin que éso implique que se deje de correr el contenedor

   Si vamos a docker desktop veremos que nuestro contenedor está levantado:

   ![Contenedor de PostgreSQL en Docker Desktop](./assets/docker-desktop-container-list.png)

3. En nuestro `.gitignore` agregaremos la carpeta `orders/postgres` donde se guardan cosas relacionadas a la DB que no deben subirse al proyecto.

   Éste directorio se crea por defecto cuando corremos por primera vez el comando anterior.

4. Conectarse a la DB desde cualquier gestor de DB usando los valores definidos en las variables del `.yaml`

### 7- Prisma - Modelo y conexión

1. Instalamos `prisma`
2. Instalamos el CLI haciendo `npx prisma`
3. Inicializamos el paquete: `npx prisma init`
   Ésto me creará el `orders/prisma/schema.prisma` y me actualizará el `orders/.env`.
4. Modificamos el valor de `DATABASE_URL` para que coincida con los datos que definimos en las variables de entorno de nuestro contenedor
   
   La estructura del path es: `"tipo de DB://user:password@dominio:puerto/nombre db?schema=public"`. En nuestro caso, según lo que definimos en el `orders/docker-compose.yaml`, quedaría:

   ```environment
   DATABASE_URL="postgresql://postgres:123456@localhost:5432/orders_db?schema=public"
   ```
5. Instalar el cliente de prisma
6. Actualizar el `schema.prisma` con el enum `OrderStatus` y el modelo `Order`
7. Ejecutar la migración: `npx prisma migrate dev --name init`
   > Fijarse que el nombre de la DB definida en la variable de entorno sea la correcta, porque si no no se van a crear las tablas correctamente y prisma igual no va a devolver error.
8. Actualizar el `./orders/src/orders/orders.service.ts` para que extienda de `PrismaClient` e implemente `OnModuleInit`. En el constructor implementamos la lógica de conexión a la DB.
9. Implementamos una instancia del `Logger` para imprimir cuando se haya realizado la conexión a la DB de forma correcta.

### 8- Crear una nueva Orden

1. Instalar `class-validator` y `class-transformer`
2. Agregamos las configuraciones de pipes en el `main.ts`
3. Modificar el `./orders/src/orders/dto/create-order.dts.ts`
4. Copiar el DTO a `./gateway/src/orders/dto/create-order.dto.ts`
5. Correr en orders `npx prisma generate`
6. Eliminar del `schema.prisma` la propiedad `output` para que no devuelva error al levantar la app
se crea por defecto dentro de:

```prisma
generator client {
  provider = "prisma-client-js"
}
```