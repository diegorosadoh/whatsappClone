var socket = io();

/**
 * Función ejecutada al loguearse un nuevo usuario
 */
function newUser(){
    //Se obtienen los valores del formulario de login
    let username = $('#username').val();
    let status = $('#status').val();
    let pfpic = $('input[name="profilepic"]:checked').attr('id');

    //Si ninguno de los campos está vacío se levanta
    // el evento para añadir un nuevo usuario y
    // se oculta el formulario de login
    if(username!=='' && status!=='' && pfpic!==''){
        socket.emit('newUser',username,status,pfpic);
        $('.modal-bg').css('display', 'none');
    }
}

/**
 * Función ejecutada al enviar un mensaje
 */
function enviar(){
    //Se obtiene el mensaje de la caja de texto
    let input = $('.input-msg');

    //Si el mensaje no está vació se levanta
    // el evento para añadir un nuevo mensaje a la vista
    // y el evento para indicar que el usuario ha dejado de escribir
    if(input.val().length>0){
        socket.emit('chatmsg', input.val());
        socket.emit('notWriting');
    }

    //Finalmente se resetea el contenido del input
    input.val("");
}

/**
 * Función ejecutada al pulsar cualquier tecla
 * en la caja de texto para escribir o enviar un mensaje.
 * Si el usuario pulsa una tecla se muestra al resto de
 * usuarios que está escribiendo durante dos segundos. Si no
 * vuelve a escribir en ese tiempo, el estado vuelve a su origen.
 */
var wait; //Variable global que guarda el retardo para mostrar que un usuario está escribiendo
function writing(e){
    //Si la tecla pulsada es 'enter', se envía el mensaje
    if(e.keyCode==13){
        enviar();
    }else{
        //Se levanta el evento que muestra que el usuario está escribiendo
        socket.emit('writing');

        //Se elimina el Timeout si ya existe
        clearTimeout(wait);

        //Se crea un nuevo Timeout que dura 2 segundos
        wait = setTimeout(()=>{socket.emit('notWriting')},2000);
    }
}

/**
 * Evento para mostrar la ventana de login
 * Se levanta al realizarse una nueva conexión 
 */
socket.on('loginPopUp',()=>{
    //Se crea la ventana y se añade al body
    let popup = $(`<div class="modal-bg">
    <div id="modal">
        <span>WhatsApp Login</span>
        <div class="form">
            <input id="username" name="username" type="text" placeholder="Username" required>
            <input id="status" name="status" type="text" placeholder="Status" required>
            <div class="pics">
                <input type="radio" name="profilepic" id="jerry" checked>
                <label class="avatar" for="jerry">
                    <img src="./assets/pfpics/jerry.jpg" alt="Avatar">
                </label>

                <input type="radio" name="profilepic" id="cactus">
                <label class="avatar" for="cactus">
                    <img src="./assets/pfpics/cactus.jpg" alt="Avatar">
                </label>

                <input type="radio" name="profilepic" id="skull">
                <label class="avatar" for="skull">
                    <img src="./assets/pfpics/skull.jpg" alt="Avatar">
                </label>

                <input type="radio" name="profilepic" id="spices">
                <label class="avatar" for="spices">
                    <img src="./assets/pfpics/spices.jpg" alt="Avatar">
                </label>

                <input type="radio" name="profilepic" id="stitch">
                <label class="avatar" for="stitch">
                    <img src="./assets/pfpics/stitch.jpg" alt="Avatar">
                </label>
            </div>
            <button name="submit" id="submit" onclick="newUser()">Login</button>
        </div>
    </div>
    </div>`);

    $('body')
    .append(popup);
});

/**
 * Evento para actualizar la vista de los usuarios conectados
 * Se levanta al conectarse o desconectarse un usuario
 */
socket.on('updateUsers',(users,newUser,connect)=>{
    //Se crea el elemento para informar de la nueva conexión/desconexión
    let info = connect ? "conectado" : "desconectado"
    let nuevo = $('<div class="message received newuser">')
    .html(`<b>${newUser}</b> se ha ${info}`)
    .append(`<span class="metadata"><span class="time"></span></span>`);

    $('.conversation-container')
    .append(nuevo);

    //Se vacía el contenedor de las barras de usuario
    $('.users').html("");

    //Por cada usuario se crea una nueva barra con su información
    users.forEach(user => {
        $('.users')
        .prepend(`<div class="user-bar">
        <div class="avatar">
            <img src="./assets/pfpics/${user.pfpic}.jpg" alt="Avatar">
        </div>
        <div class="name">
            <span class="nameuser">${user.username}</span>
            <span class="status">${user.status}</span>
        </div>
        </div>`);
    });
});

/**
 * Evento para añadir un nuevo mensaje ajeno a la vista
 * Se levanta cuando se recibe un nuevo mensaje
 */
socket.on('nuevomsg',(msg,name,color)=>{
    //Se crea el elemento para el mensaje y se añade al contenedor
    let nuevo = $('<div class="message received">')
    .html(msg)
    .append(`<span class="metadata"><span class="time"></span></span>`)
    .prepend(`<div class="username" style="color:#${color}">${name}</div>`);

    $('.conversation-container')
    .append(nuevo);
});

/**
 * Evento para añadir un nuevo mensaje propio a la vista
 * Se levanta cuando se envía un nuevo mensaje
 */
socket.on('enviar',(msg)=>{
    //Se crea el elemento para el mensaje y se añade al contenedor
    let nuevo = $('<div class="message sent">')
    .html(msg)
    .append(`<span class="metadata">
    <span class="time"></span><span class="tick"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg></span>
    </span>`);

    $('.conversation-container')
    .append(nuevo);
});

/**
 * Evento para cambiar el estado cuando un usuario está escribiendo
 * Se levanta cuando algún usuario escribe
 */
socket.on('writing',(username)=>{
    //Se busca la barra de usuario indicada y se actualiza el estado
    $('.nameuser').filter(function() {
        return $(this).text() === username;
    }).next().html('writing...').css('font-weight','bold');
});

/**
 * Evento para cambiar el estado cuando un usuario deja de escribir
 * Se levanta cuando algún usuario pasa 5 segundos sin escribir
 *  desde la última vez que pulsó alguna tecla
 */
socket.on('notWriting',(username,status)=>{
    //Se busca la barra de usuario indicada y se actualiza el estado
    $('.nameuser').filter(function() {
        return $(this).text() === username;
    }).next().html(status).css('font-weight','normal');
});