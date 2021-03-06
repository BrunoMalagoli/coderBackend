const socket = io.connect();
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
//Messages
socket.on("initialMessages", async () => {
  let data = await getInitialDataDenormalized();
  renderMessages(data);
});
async function toDenormalize(data) {
  try {
    let dataDenormalized = await fetch(
      "http://localhost:8080/api/mensaje-desnormalizado",
      {
        method: "POST",
        body: data,
      }
    );
    return dataDenormalized;
  } catch (e) {
    console.log(e);
  }
}
function getInitialDataDenormalized() {
  let dataDenormalized = fetch(
    "http://localhost:8080/api/mensajes-desnormalizados"
  )
    .then(async (resp) => {
      let respuesta = await resp.json();
      console.log(respuesta);
      return respuesta;
    })
    .catch((e) => {
      console.log(e);
    });
  return dataDenormalized;
}
function renderMessages(data) {
  let timestamp = Date.now();
  console.log(data);
  let mensajes = data.json();
  console.log("mensajes" + mensajes);
  let chat = mensajes
    .map((mensaje) => {
      return `
        <span><b>${mensaje.author.email}</b> (${timestamp}): ${mensaje.text}</span><br>
        `;
    })
    .join(" ");
  document.getElementById("chat").innerHTML = chat;
}
socket.on("messageNew", async (data) => {
  console.log(data);
  try {
    let dataDenormalizada = await toDenormalize(data);
    console.log("dataDenormalizada" + JSON.stringify(dataDenormalizada));
    renderMessages(dataDenormalizada);
  } catch (e) {
    console.log(e);
  }
});
//Session
let userLogged;
socket.on("loggedIn", (user) => {
  userLogged = user;
  const html = document.getElementById("logInHeader");
  const newHtml = `<h1>Bienvenido ${user}</h1>
                  <button type="button" onclick=logOut()>Desloguearse</button>`;
  html.innerHTML = newHtml;
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
    mensajes = [];
  } catch (e) {
    console.log(e);
  }
}

async function logIn() {
  try {
    let name = await document.getElementById("logInName").value;
    await fetch("http://localhost:8080/login", {
      method: "POST",
      body: "name=" + name,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
  } catch (e) {
    console.log(e);
  }
}
function logOut() {
  try {
    const html = document.getElementById("logInHeader");
    const newHtml = `<h1>Hasta luego ${userLogged}</h1>`;
    html.innerHTML = newHtml;
    setTimeout(async () => {
      await fetch("http://localhost:8080/logout").catch((e) => console.log(e));
      window.location.href = "http://localhost:8080/";
    }, 2000);
  } catch (e) {
    console.log(e);
  }
}
