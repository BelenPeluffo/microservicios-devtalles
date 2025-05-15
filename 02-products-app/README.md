## Sección 4 - Reforzamiento

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

    > Para poder abrir la DB, simplemente desde DBeaver hacemos Archivo > Buscar archivo denominado > filtrar por *.db y abrir el archivo. Ahí se abrirá una conexión nueva dentro de la carpeta `File databases`.

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