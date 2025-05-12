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
