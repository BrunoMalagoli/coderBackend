const socket = io.connect();
//const { denormalize } = require("normalizr");
//const { msjSchema } = require("../server");
//Products

function render(data) {
  let html = data
    .map((producto) => {
      return `
        <div>
        <p>${producto.name}</p>
        <p>${producto.price}</p>
        <p>${producto.thumbnail}</p>
        </div><br>`;
    })
    .join(" ");
  document.getElementById("tableBody").innerHTML = html;
}
socket.on("initialProducts", (data) => {
  render(data);
});
socket.on("initialMessages"),
  (data) => {
    const denormalizado = denormalize(data.result, msjSchema, data.entities);
    console.log(denormalizado);
    renderMessages(denormalizado);
  };
//Messages
function renderMessages(data) {
  let timestamp = Date.now();
  let chat = data
    .map((mensaje) => {
      return `
        <span><b>${mensaje.author.email}</b> (${timestamp}): ${mensaje.text}</span><br>
        `;
    })
    .join(" ");
  document.getElementById("chat").innerHTML = chat;
}
socket.on("messageNew", (data) => {
  const denormalizado = denormalize(data.result, msjSchema, data.entities);
  console.log(denormalizado);
  renderMessages(denormalizado);
});

//Utiles

let mensajes = [];
const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

//Funcion submit
async function newMessage() {
  try {
    const mensaje = {
      author: {
        email: await document.getElementById("mail").value,
        name: await document.getElementById("name").value,
        lname: await document.getElementById("lname").value,
        age: await document.getElementById("age").value,
        alias: await document.getElementById("alias").value,
        avatar: await document.getElementById("image").value,
      },
      text: await document.getElementById("msj").value,
    };
    mensajes.push(mensaje);
    socket.emit("new-message", mensajes);
  } catch (e) {
    console.log(e);
  }
}
