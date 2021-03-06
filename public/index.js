const socket = io();
const chat = document.getElementById('chat');
const inputMsg = document.getElementById('input-message');
const btnSend = document.getElementById('btn-send');

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "100",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "show",
    "hideMethod": "hide"
};

let username = '';
Notification.requestPermission().then(permission => console.log(permission));

const getMessage = () => ({ user: username, message: inputMsg.value, time: new Date() });

const promptUsername = () => prompt('Escoja su nombre de usuario');

const askForUsername = () => {
    const usernamePrompt = promptUsername();
    if (usernamePrompt){
        username = usernamePrompt;
        socket.emit('new-connected',{ user: username });
    } else {
        askForUsername();
    }
}


const toastMessage = (username) => {
    toastr.info(`${ username } se ha unido al chat! Dadle la bienvenida`);
}

const notify = () => {
    const options = {
        body: 'Hay un nuevo mensaje',
    }
    const notification = new Notification('Mensaje', options);
};

const addNewMessage = (messageInfo) => {
    const msgDiv = document.createElement('div');
    const p = document.createElement('span');
    const userSpan = document.createElement('span');
    const date = document.createElement('span');
    userSpan.innerText = messageInfo.user;
    userSpan.classList.add('msg-user');
    p.innerText = messageInfo.message;
    date.innerText = `${messageInfo.time.getHours()}:${messageInfo.time.getMinutes()}`;
    date.classList.add('msg-date');
    msgDiv.appendChild(userSpan);
    msgDiv.appendChild(p);
    msgDiv.appendChild(date);
    msgDiv.classList.add('msg');
    msgDiv.classList.add(messageInfo.className);
    chat.appendChild(msgDiv);
    document.hasFocus() ? notify() : null;
}
const addMessageReceiver = (messageInfo) => {
    const msgDiv = document.createElement('div');
    const p = document.createElement('span');
    const userSpan = document.createElement('span');
    const date = document.createElement('span');
    userSpan.innerText = messageInfo.user;
    userSpan.classList.add('msg-user');
    p.innerText = messageInfo.message;
    const fecha = new Date(messageInfo.time);
    date.innerText = `${ fecha.getHours() }:${ fecha.getMinutes() }`;
    date.classList.add('msg-date');
    msgDiv.appendChild(userSpan);
    msgDiv.appendChild(p);
    msgDiv.appendChild(date);
    msgDiv.classList.add('msg');
    msgDiv.classList.add(messageInfo.className);
    chat.appendChild(msgDiv);
    !document.hasFocus() ? notify() : null;
}

socket.on('joined',_ => alert('Se ha unido un nuevo usuario'));
socket.on('toast',username => toastMessage(username));
socket.on('full-room',_ => alert('La sala esta completa'));
socket.on('message',messageInfo => addMessageReceiver(messageInfo));

askForUsername();

btnSend.addEventListener('click', ev => {
    const messageInfo = getMessage();
    if(messageInfo.message){
        socket.emit('newMessage', messageInfo);
        messageInfo.className = 'sender';
        addNewMessage(messageInfo);
        inputMsg.value = ''; 
    } else{
        alert('Escribe un mensaje');
    }
});