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