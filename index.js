const express = require('express')
const app = express()
const port = 3000

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

io.on('connection', (socket) => {
  /* Evento para mostrar la ventana de login */
  socket.emit('loginPopUp');
  
  /* Evento para añadir un nuevo usuario */
  socket.on('newUser',(username,status,pfpic)=>{
    //Si el nombre de usuario ya existe, se le añade un número aleatorio al final
    if(users.some(user=>user.username==username)) username+=Math.floor((Math.random() * 10)).toString();

    //Se añaden los valores al propio socket
    socket.username = username;
    socket.status = status;
    socket.pfpic = pfpic;
    socket.color = Math.floor(Math.random()*16777215).toString(16);

    //Se añaden los valores al array de usuarios
    users.push({
      'username': socket.username,
      'status': socket.status,
      'pfpic': socket.pfpic,
      'color': socket.color
    });

    //Se levanta el evento para actualizar la vista de los usuarios conectados
    io.sockets.emit('updateUsers',users);
  });

  /* Evento para desconectar un usuario */
  socket.on('disconnect', () => {
    //Se actualiza el array de usuarios
    users = users.filter(user=>user.username!==socket.username);

    //Se levanta el evento para actualizar la vista de los usuarios conectados
    io.sockets.emit('updateUsers',users);
  });

  /* Evento para añadir un nuevo mensaje a la vista */
  socket.on('chatmsg', (msg)=>{
    //Se levanta un evento para añadir un nuevo mensaje ajeno para el resto de usuarios
    socket.broadcast.emit('nuevomsg',msg,socket.username,socket.color);

    //se levanta un evento para añadir un nuevo mensaje propio para el emisor
    socket.emit("enviar",msg,socket.username);
  });

  /* Evento para añadir un nuevo mensaje privado a la vista */
  socket.on('privateChatmsg', (msg,user)=>{
    //Se levanta un evento para añadir un nuevo mensaje ajeno para el resto de usuarios
    //io.to(socketId).emit('nuevomsg',msg,socket.username,socket.color);

    //se levanta un evento para añadir un nuevo mensaje propio para el emisor
    //socket.emit("enviar",msg,socket.username);
  });

  /* Evento para mostrar que un usuario está escribiendo */
  socket.on('writing',()=>{
    io.sockets.emit('writing',socket.username);
  });

  /* Evento para mostrar el estado original de un usuario cuando deja de escribir */
  socket.on('notWriting',()=>{
    io.sockets.emit('notWriting',socket.username,socket.status);
  });

  socket.on('private', (user)=>{
    socket.emit('private', user);
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);
server.listen(3000);