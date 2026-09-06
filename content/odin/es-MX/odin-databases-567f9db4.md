# Bases de datos

## Introducción

Quizá te hayas preguntado cómo se conserva la información de las personas que usan una aplicación. ¿Dónde se guarda una cuenta para reconocerla cuando vuelve a iniciar sesión? La base de datos es la capa que permite recordar información entre solicitudes y reinicios. Puede ser tan sencilla como una hoja de cálculo o estar distribuida entre muchos servidores.

Como normalmente no la vemos en la interfaz, una base de datos puede parecer misteriosa. No necesitas dominarla antes de empezar: aprenderás a organizar información y a consultar lo que necesitas. Para contraseñas, recuerda desde ahora que una aplicación segura almacena un hash adecuado, nunca el texto original.

SQL, el lenguaje de consultas estructuradas, tiene menos palabras de uso cotidiano que un lenguaje de programación general. La dificultad suele estar en imaginar qué conjunto de filas produce una consulta. Esta lección introduce los conceptos; las siguientes te darán práctica.

## Objetivos

- Explicar qué es una base de datos y para qué sirve.
- Describir una base de datos relacional.
- Distinguir tablas relacionadas de documentos como XML.
- Explicar qué significa SQL y para qué se utiliza.
- Recuperar todos los registros de una tabla.
- Insertar un nuevo registro.

## Tablas, relaciones y documentos

Una tabla reúne registros de un mismo tipo. Cada fila representa un registro y cada columna un atributo. En una tabla de estudiantes podrías tener identificador, nombre y correo. Una clave primaria identifica de manera única cada fila; no tiene que ser el nombre de la persona, porque los nombres pueden repetirse.

Las relaciones conectan tablas mediante identificadores. Una entrega puede apuntar al identificador de su autora sin repetir toda su información. Los documentos XML representan datos mediante elementos anidados; una base relacional organiza tablas y relaciones con reglas explícitas. XML es un formato de representación, no por sí mismo un sistema que ejecute consultas SQL.

SQL permite definir estructuras, consultar, insertar, modificar y eliminar datos. Por ejemplo, en una base de práctica:

```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
INSERT INTO students (id, name) VALUES (1, 'Ana');
SELECT * FROM students;
```

La última instrucción devuelve todas las columnas y filas de la tabla. El asterisco es útil para explorar, aunque las aplicaciones suelen seleccionar únicamente las columnas que necesitan.

Las bases no relacionales también existen. Algunas almacenan documentos, pares clave-valor o grafos. Elegir SQL no implica que las otras opciones sean inútiles; debes comparar relaciones, consultas y reglas del problema.

## Actividad

1. Lee la [introducción de Launch School sobre cómo organizar grandes cantidades de datos con SQL](https://launchschool.com/books/sql/read/introduction). Solo necesitas la primera página.
2. Mira esta [introducción breve a las bases de datos relacionales](http://www.youtube.com/watch?v=z2kbsG8zsLM) para familiarizarte con el vocabulario.
3. Completa el [tutorial de SQL de Khan Academy](https://www.khanacademy.org/computing/hour-of-code/hour-of-sql/v/welcome-to-sql). Crea una tabla, inserta registros y modifica tus consultas; no te limites a mirar.
4. Lee la [comparación entre SQL y NoSQL](https://circleci.com/blog/SQL-vs-NoSQL-databases/).
5. Explica con tus propias palabras cómo conectarías estudiantes y entregas sin copiar el correo del estudiante en cada entrega.

Los recursos externos pueden estar en inglés; esta explicación y las instrucciones de trabajo están disponibles en español.

## Comprueba lo aprendido

- ¿Qué es una base de datos?
- ¿Qué caracteriza a una base relacional?
- ¿Para qué sirve una clave primaria?
- ¿Qué significa SQL?
- ¿Cómo recuperas todos los registros de una tabla?
- ¿Cómo insertas un registro?
- ¿Qué diferencia hay entre representar datos en XML y administrarlos en una base relacional?

