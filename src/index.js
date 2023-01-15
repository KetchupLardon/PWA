
let chat = document.getElementById("chat");
let firstName = document.getElementById("firstName");
let message = document.getElementById("message");
let button = document.getElementById("submit");

//On load, always bring the scroll bar to bottom
window.onload=function () {
    window.innerWidth = window.outerWidth;
    const requestNotification = () => {
        Notification.requestPermission().then(permission => {
            console.log(permission);
        });
    }
    if(Notification.permission === 'default'){
        requestNotification();
    }
    chat.scrollTop = chat.scrollHeight;
}


const displayNotification = (message) => {
    const params = {
        body: message,
        icon: "./icons/chat-logo.png"
    }
    new Notification("Message envoyé", params);
}

const showMessage = (content) => {
    let divContainer = document.createElement('div');
    let divName = document.createElement('div');
    let divMessage = document.createElement('div');

    divName.innerHTML = `${content.name}: `;
    divMessage.innerHTML = content.message;
    divContainer.appendChild(divName);
    divContainer.appendChild(divMessage);
    chat.appendChild(divContainer);
}

//Create div rows for each messages if there are messages store in the localStorage
if(localStorage.getItem('messages')){
    JSON.parse(localStorage.getItem("messages")).map( content => { 
        showMessage(content);
    });
}

if(localStorage.getItem('firstName')){
    firstName.value = localStorage.getItem('firstName');
}

button.addEventListener("click", e => {
    e.preventDefault();
    if(firstName.value === "" || message.value === ""){
        alert("Vous devez saisir votre nom et un message");
    } else {
        localStorage.setItem('firstName', firstName.value);
        let messages = [];
        if(localStorage.getItem('messages')){
            messages = JSON.parse(localStorage.getItem('messages'));
        }
        let item = {
            'name': firstName.value,
            'message': message.value
        }
        showMessage(item);
        chat.scrollTop = chat.scrollHeight;
        messages.push(item);
        localStorage.setItem('messages', JSON.stringify(messages));
        if(Notification.permission === 'granted'){
            displayNotification(message.value);
        }
        message.value = "";
    }
});

//Create the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered!");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration Failed!");
        console.log(error);
    });
}
if(window.caches){
    caches.open('Chat-PWA').then(
        cache => {
            cache.addAll([
                "index.html",
                "sw.js"
            ])
        }
    )
}