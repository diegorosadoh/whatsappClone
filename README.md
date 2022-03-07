# WhatsApp Clone

Aplicación web clon de WhatsApp. La aplicación permite la comunicación vía chat entre diferentes usuarios. Todos ellos se conectan a la misma sala, mostrándose su información (nombre, estado y foto de perfil) en la barra superior. Al conectarse un nuevo usuario aparece una ventana para realizar el login, introduciendo el nombre de usuario, el estado y eligiendo uno de los cinco avatares disponibles. Se le asigna además un color aleatorio, que será el color en el que se disponga su nombre de usuario al enviar mensajes a otros usuarios. Al escribir su estado cambia a "writing...", y al pulsar la tecla 'enter' o el botón de enviar, el mensaje aparece en el chat. La información de cada usuario se puede encontrar tanto en el propio objeto 'socket' como en el array de objetos 'users'. Cada vez que se conecta o desconecta un usuario la barra de usuarios se actualiza.

Proyecto realizado con Node.js, Express y Socket.io para la comunicación entre cliente y servidor.

EN PRODUCCIÓN: https://whatsapp-clone-diego-rosado.herokuapp.com