# Configura Git y GitHub

[Git](https://git-scm.com/) controla versiones de archivos localmente. [GitHub](https://github.com/) aloja repositorios Git y facilita colaboración mediante una interfaz web. No son la misma herramienta ni necesitas conexión para crear un commit local. Ahora instalaremos Git y prepararemos la autenticación; las siguientes lecciones explican su uso.

## Instala Git en el entorno correcto

En Windows con WSL2 instala Git dentro de Ubuntu siguiendo la [guía Linux](https://github.com/TheOdinProject/curriculum/tree/main/foundations/installations/installation_guides/git/linux.md). En macOS sigue la [guía macOS](https://github.com/TheOdinProject/curriculum/tree/main/foundations/installations/installation_guides/git/macos.md). La alternativa [ChromeOS](https://github.com/TheOdinProject/curriculum/tree/main/foundations/installations/installation_guides/git/chromeos.md) permanece disponible para quien la necesite. Para Windows nativo, utiliza el [instalador oficial de Git](https://git-scm.com/downloads/win) y Git Bash para los ejemplos de esta lección. No mezcles las instalaciones nativa y WSL dentro del mismo proyecto.

Ejecuta `git --version` en la terminal donde trabajarás. Si no se encuentra el comando, cierra y abre la terminal después de instalar y revisa la guía correspondiente.

## Identidad y privacidad

Crea tu cuenta en GitHub y verifica el correo. En [Email Settings](https://github.com/settings/emails), puedes activar **Keep my email addresses private** y **Block command line pushes that expose my email**. Copia la dirección `noreply` que GitHub asigna a tu cuenta; no inventes una. Ésta permite atribuir commits sin publicar tu correo personal. Esta [captura original](https://cdn.statically.io/gh/TheOdinProject/curriculum/725b80d126105d2f717697f97e7eaefb5f886c7b/foundations/installations/setting_up_git/imgs/01.png) ilustra las opciones.

Configura tu nombre y correo sustituyendo los ejemplos:

```bash
git config --global user.name "Tu nombre"
git config --global user.email "TU_DIRECCION_NOREPLY"
git config --global init.defaultBranch main
git config --get user.name
git config --get user.email
```

`--global` aplica al usuario de esa computadora. En un laboratorio con cuentas compartidas, pide una cuenta de sistema propia o usa configuración local al repositorio cuando corresponda; no dejes tu identidad en una sesión que usarán otras personas. En macOS puedes añadir `.DS_Store` a un archivo global de exclusiones y configurar `core.excludesfile` para que esos metadatos de Finder no entren a los commits. No sobrescribas una configuración existente sin revisarla.

Considera activar [autenticación de dos factores](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication#configuring-two-factor-authentication-using-a-totp-app). Una aplicación TOTP, como la descrita en la [guía de Google Authenticator](https://support.google.com/accounts/answer/1066447), añade un segundo factor. Guarda los códigos de recuperación fuera del repositorio: perder ambos medios puede impedir recuperar el acceso.

## Conecta mediante SSH

Una llave SSH tiene una parte pública que puedes registrar en GitHub y una privada que permanece protegida en tu equipo. Revisa si ya existe una llave:

```bash
ls ~/.ssh/id_ed25519.pub
```

Si no existe, genera una con `ssh-keygen -t ed25519`. Acepta la ubicación predeterminada sólo si no sobrescribe otra llave. Usa una frase de contraseña para protegerla. Puedes registrar varias llaves en GitHub, una por dispositivo; no copies una llave privada a un equipo compartido.

En GitHub abre `Settings > SSH and GPG keys > New SSH key`, elige **Authentication Key** y un nombre que identifique el equipo. Muestra la parte pública:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copia la línea completa, que empieza por `ssh-ed25519`, en GitHub. El sufijo `.pub` es esencial: nunca compartas el archivo sin ese sufijo. Consulta [qué hace cat](https://www.linfo.org/cat.html) si el comando es nuevo para ti.

Sigue la [prueba de conexión SSH de GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection?platform=linux). Antes de aceptar la identidad del servidor compara su huella con las [huellas oficiales](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints). El mensaje `Hi username! You've successfully authenticated, but GitHub does not provide shell access.` confirma autenticación: que no ofrezca acceso al shell es normal.

## Actividad y comprobación

1. Verifica instalación e identidad desde la terminal de trabajo.
2. Registra la llave pública y comprueba SSH. Si falla, conserva el error sin incluir tu llave privada; puedes pedir orientación en el [Discord de Odin](https://discord.gg/fbFCkYabZB).
3. Explica qué parte de la configuración identifica al autor del commit y qué parte autoriza la conexión remota.

- ¿Qué son Git y GitHub?
- ¿Usamos SSH o HTTPS para esta configuración de autenticación?
- ¿Por qué la llave privada y el correo personal necesitan cuidados distintos?

## Revisa qué identidad queda registrada

El nombre y correo de Git identifican al autor de un commit; no son una contraseña y no autentican por sí solos el acceso a GitHub. Configurar un correo distinto no cambia qué cuenta posee una llave SSH. Esta separación importa cuando el historial aparece con una identidad inesperada aunque push funcione correctamente.

Verifica ambos valores con los comandos de lectura antes del primer commit. Si elegiste privacidad, copia exactamente la dirección noreply asignada por GitHub. Una dirección inventada puede no asociarse con tu cuenta. En el laboratorio, utiliza una cuenta de sistema propia o una configuración local acordada para evitar que el siguiente estudiante confirme cambios con tu identidad.

## Protege la parte privada

El archivo público termina en pub y puede registrarse en GitHub. El archivo privado correspondiente no lleva ese sufijo y debe permanecer en el equipo protegido. Una frase de contraseña cifra esa llave local; no es la misma contraseña de GitHub. Si alguien obtiene una llave privada sin protección, puede usar los permisos asociados hasta que la revoques.

Cuando generes una llave, lee cualquier aviso sobre un archivo existente. No sobrescribas una llave anterior que todavía utilices en otros servicios. Puedes tener varias llaves registradas, cada una con un nombre descriptivo del dispositivo, y retirar una cuando ya no controles ese equipo.

Al probar la conexión, compara la huella del servidor con la documentación oficial antes de aceptar. El mensaje de éxito indica autenticación para operaciones Git, no que GitHub te permita una sesión de shell general. Esa distinción explica por qué el aviso sobre falta de shell access no es un fracaso. Después de completar el ejercicio, cierra sesiones en equipos compartidos y conserva los métodos de recuperación de tu cuenta fuera del repositorio.
