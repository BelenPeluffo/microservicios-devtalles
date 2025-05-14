## Sección 4 - Reforzamiento

### 1- Creación de proyecto
Existen por lo menos dos formas de crear los microservicios que implementaremos y de relacionarlos.
1. `nest g app <nombre-microservicio>` por cada microservicio que queramos. Ésto creará cada uno dentro de la carpeta `app` del proyecto creado
2. crear dentro de una misma carpeta cuatro apps distintas y separadas, es decir que ejecutaremos cuatro veces el comando de siempre para crear apps -> **éste es el approach que tomaremos**.

### 4- Inicio de microservicio - `Products`
Este primer servicio lo vamos a crear primero implementado una API REST, para familiarizarnos con los nuevos conceptos de microservicios.

1. Eliminamos el controller y su test, y el service de `app`.
2. Creamos recurso products: `nest g res products --no-spec`.