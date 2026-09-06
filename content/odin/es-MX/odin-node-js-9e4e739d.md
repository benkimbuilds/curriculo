# Proyecto: aplicación de inventario

## El producto

Construye el inventario de una tienda imaginaria: instrumentos, alimentos, videojuegos u otro tema. Desde el inicio se elige una categoría y se ven sus artículos. Tanto categorías como artículos deben permitir crear, leer, actualizar y eliminar: no basta con una lista estática.

## Actividad

1. Crea Next App Router y una base PostgreSQL de práctica.
2. Diseña tablas, campos, relaciones y restricciones antes de programar. Un juego puede tener varios géneros y desarrolladores; una categoría puede contener muchos artículos. Si tu dominio tiene relaciones muchos a muchos, usa una tabla intermedia.
3. Define rutas de listas, detalles y formularios. Los componentes del servidor consultan datos; Server Actions o Route Handlers ejecutan escrituras validadas.
4. Construye primero las vistas de lectura de categoría y artículo.
5. Implementa formularios de creación y edición. Además de nombres y descripción, elige campos útiles como precio y existencias. Guarda importes en centavos enteros o un tipo decimal adecuado, nunca dependas de redondeos de punto flotante.
6. Define la eliminación de una categoría con artículos: impedirla, reasignarlos o eliminarlos conjuntamente. Explica la regla en la interfaz y refuérzala con claves foráneas y transacciones.
7. Crea un script de datos ficticios y ejecútalo en tu base local. Repite de manera controlada al desplegar, sin sobrescribir datos reales.
8. Publica la aplicación y documenta cómo probar cada operación.

## Ejemplo de relación

```sql
CREATE TABLE categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE items (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0)
);
```

Este diseño elige impedir eliminar categorías ocupadas. Si necesitas varios géneros por artículo, reemplaza esa relación por una tabla intermedia; no guardes IDs separados por comas.

## Criterios de aceptación

- Puedes completar CRUD de categoría y artículo desde la interfaz.
- Cambiar un artículo actualiza la lista y su detalle.
- Valores negativos, campos vacíos e IDs inexistentes producen errores útiles sin cambiar datos.
- La regla de eliminación se mantiene incluso si llamas directamente al endpoint.
- Consultas con entrada de usuario están parametrizadas.
- Sembrar datos e iniciar desde una base vacía tiene pasos repetibles.
- Se conservan datos tras reiniciar el servicio.

## Extensiones

Mejora la presentación después de completar CRUD. Para proteger edición y eliminación, usa autenticación y un rol administrador del servidor. El original propone una contraseña administrativa compartida como ejercicio intermedio; aquí la sustituimos por autorización de sesión. No pongas secretos en JavaScript del navegador ni confíes en ocultar botones. Puedes permitir CRUD en una demostración aislada con datos ficticios antes de añadir cuentas.

