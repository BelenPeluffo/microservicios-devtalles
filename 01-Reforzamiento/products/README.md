## Sección 2 - Reforzamiento

### 5- Crear producto y validaciones

- Para definir como path base a `/api`, tenemos que hacer en `main.ts`: `app.setGlobalPrefix('api')`.
- Para gestionar las validaciones, usamos `class-validator` y `class-transformer`.

  - Los decoradores son los que nos permiten realizar las validaciones.

  - Para que los EPs **no acepten propiedades que no estén definidas** y lance error, es necesario definir en `main.ts`:

  ```typescript
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  ```

  - El decorador `Type()` del `class-transformer` le indica a la app que tiene que intentar transformar lo que reciba en la propiedad a un tipo que se defina en su argumento:

  ```typescript
  export class CreateProductDto {
    @IsNumber()
    @Type(() => Number)
    price: string;
  }
  ```

- Los DTOs determinan la estructura de los objetos que yo voy a recibir.

### 6- Servicios y respuestas

> Disclaimer: primeramente, vamos a gestionar la persistencia en memoria. Luego lo haremos en DB. Ésto implicará que cada vez que se recargue la app perderemos todos los datos almacenados.

- Los servicios es donde se implementa la lógica de negocio.
- La clase en que se construye la entidad se define usando un constructor que tome las distintas propiedades para después poder crear objetos en base a esta clase y que se le asignen los valores correspondientes en base a lo obtenido por argumentos.

  ```typescript
  // product.entity.ts - DEFINICIÓN
  export class Product {
    constructor(
      public id: string,
      public name: string,
      public description: string,
      public price: number,
    ) {}
  }

  // products.service.ts - INSTANCIACIÓN
  const newProduct = new Product(uuid(), name, description, Number(price));
  ```

### 7- Listar y eliminar productos

- Implementamos algunos métodos en `products.service.ts`
  
  - findAll
  - find
  - delete - teniendo en cuenta que la convención es enviar en el response el objeto eliminado.

    > En estos últimos dos métodos, como estamos usando como valor de ID a un UUID, es necesario usar en el controller el `ParseUUIDPipe` y pasárselo como segundo parámetro al decorador `@Param()` del EP. Ésto es así para validar que sí o sí le llegue como parámetro `:id` un valor UUID.

### 8- Actualizar producto

- Implementamos el método faltante en `products.service.ts`: `update()`

  > Observar que ya cuando corrimos el comando `nest generate resource <nombre>` crea el DTO para el update de la entidad y la implementaciónde éste se ve así, incialmente:
    ```typescript
    export class UpdateProductDto extends PartialType(CreateProductDto) {}
    ```

  Lo que hace `PartialType(CLASE)` de nestjs es lo mismo que hace `Partial<TYPE | INTERFACE>` de TypeScript.

- Implementamos el método `updateWith()` en la clase `Product`, que se va a encargar de actualizar los valores de las propiedades del objeto creado.