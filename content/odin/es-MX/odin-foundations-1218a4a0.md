# ¿Cómo funciona la web?

Antes de programar una página necesitas distinguir las piezas que permiten verla. Una **red** conecta dispositivos para intercambiar información. Internet es una red de redes: tu computadora se conecta mediante un proveedor de internet (ISP), y varios routers encaminan datos hacia su destino. Un router decide por dónde continuar enviando esos datos; no es lo mismo que un sitio web.

Una **dirección IP** identifica una interfaz conectada a una red. Como las personas recordamos mejor palabras que números, usamos nombres de dominio. El **DNS** relaciona nombres como `example.com` con direcciones que permiten encontrar el servidor. Resolver el nombre no descarga todavía toda la página: permite localizar el destino de la petición.

## Cliente, servidor y documentos

Un cliente solicita un recurso; un servidor recibe la solicitud y responde. El navegador suele ser el cliente. La palabra servidor puede referirse al equipo o al programa que atiende solicitudes. Una página web es un documento que el navegador interpreta; un sitio reúne varias páginas y recursos. El navegador —Chrome, Firefox, Safari o Edge— es un programa. Un buscador —por ejemplo Google— es un servicio que ayuda a encontrar páginas. Puedes visitar un sitio escribiendo su dirección sin pasar por un buscador.

Los datos no suelen viajar como un único bloque indivisible. Se dividen en **paquetes**, con información que permite transportarlos y reconstruir la comunicación. El navegador recibe HTML y puede solicitar después imágenes, CSS y JavaScript. La conexión HTTPS protege la comunicación en tránsito; no garantiza por sí sola que la información de un sitio sea verdadera.

## Actividad: sigue una solicitud

1. Mira la [introducción de la BBC sobre internet](https://www.youtube.com/watch?v=eHp1l73ztB8) y lee [Cómo funciona internet, de Mozilla](https://developer.mozilla.org/en-US/Learn/Common_questions/How_does_the_Internet_work).
2. Mira [How the Internet Works in 5 Minutes](https://youtu.be/7_LPdttKXPc?t=46s). Dibuja tu dispositivo, el router, el ISP y otro dispositivo conectado.
3. Lee las [diferencias entre páginas, sitios, servidores y buscadores](https://developer.mozilla.org/en-US/Learn/Common_questions/Pages_sites_servers_and_search_engines).
4. Mira [qué es un navegador](https://youtu.be/BrXPcaRlBqo) e identifica [tu navegador y su versión](https://www.whatsmybrowser.org/).
5. Lee [cómo interactúan cliente y servidor](https://developer.mozilla.org/en-US/Learn/Getting_started_with_the_web/How_the_Web_works#clients_and_servers) y [cómo se resuelve una petición DNS](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name#how_does_a_dns_request_work). Como alternativa para DNS, mira este [video](https://www.youtube.com/watch?v=72snZctFFtA&t=45s).

Explica el recorrido al buscar algo en `google.com`: el navegador localiza y solicita el buscador; el buscador recibe tu consulta y devuelve resultados; abrir un resultado inicia solicitudes al sitio elegido. No confundas ambos servidores ni supongas que el buscador contiene todo internet.

## Comprobación

- ¿Qué son una red, internet, un router y un ISP?
- ¿Qué identifica una dirección IP y qué resuelve DNS?
- ¿Qué son los paquetes y por qué se usan para transferir datos?
- ¿Qué diferencia hay entre cliente, servidor, página, navegador y buscador?
- ¿Qué navegador estás usando y cómo lo verificaste?
- Describe con tus palabras lo que ocurre desde que escribes un dominio hasta que ves una página.
