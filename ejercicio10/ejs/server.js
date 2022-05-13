const express = require("express");
const PORT = 8080;
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const faker = require("faker");
const app = express();
const http = new HttpServer(app);
const io = new IOServer(http);
const axios = require("axios");
const mongoose = require("mongoose");
const URL = require("../.env/dbOpt");
const db = require("./MDBSchemas/messSchema");
const { schema, normalize, denormalize } = require("normalizr");
const util = require("util");
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let productos = [];
let mensajes;
//Func
async function getDataProducts() {
  try {
    let response;
    await axios.get("http://localhost:8080/api/productos-test").then((res) => {
      response = res.data;
    });
    return response;
  } catch (e) {
    console.log(e);
  }
}
async function getDataMessages() {
  try {
    let response;
    await axios.get("http://localhost:8080/api/mensaje").then((res) => {
      response = res.data;
    });
    return response;
  } catch (e) {
    console.log(e);
  }
}
async function mensajesIniciales() {
  try {
    let initialMjs = await getDataMessages();
    return (mensajes = initialMjs);
  } catch (e) {
    console.log(e);
  }
}
function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}
function compression(unnormalized, normalized) {
  let division = normalized / unnormalized;
  let porcentaje = division * 100;
  return porcentaje;
}
//HTTP REQUESTS

const server = http.listen(PORT, () => {
  console.log(`Servidor levantado en ${PORT}`);
});
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.get("/", (req, res) => {
  res.render(__dirname + "/views/index");
});

app.get("/api/productos-test", async (req, res) => {
  try {
    for (let i = 0; i < 5; i++) {
      let product = {
        name: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl(),
      };
      productos.push(product);
    }
  } catch (e) {
    console.log(e);
  }
  res.send(productos);
  productos = [];
});
app.post("/api/mensaje", async (req, res) => {
  const mensajes = req.body;
  const newMensajes = { id: "mensajes", mensajes };
  const normalizado = normalize(newMensajes, msjSchema);
  const denormalizado = denormalize(
    normalizado.result,
    msjSchema,
    normalizado.entities
  );
  db.Message.create(normalizado);
  res.send(db.Message.find({}));
  io.sockets.emit("messageNew", normalizado);
  print(normalizado);
  print(denormalizado);
  console.log(`Normalizado : ${JSON.stringify(normalizado).length}`);
  console.log(`Desnormalizado : ${JSON.stringify(denormalizado).length}`);
  console.log(
    `Porcentaje disminuido: ${compression(
      JSON.stringify(denormalizado).length,
      JSON.stringify(normalizado).length
    )}%`
  );
});
app.get("/api/mensaje", async (req, res) => {
  try {
    const mensajes = await db.Message.find({});
    res.send(mensajes);
  } catch (e) {
    console.log(e);
  }
});
//Normalizr Schemas
const authorSchema = new schema.Entity("author", {}, { idAttribute: "email" });
const msjSchema = new schema.Entity("msj", {
  mensajes: [{ author: authorSchema }],
});
//SOCKETS
io.on("connection", async function (socket) {
  console.log("Usuario conectado");
  io.sockets.emit("initialProducts", await getDataProducts());
  if (mensajes) {
    io.sockets.emit("initialMessages", await getDataMessages());
  }
  console.log(db);
  socket.on("new-message", (data) => {
    try {
      const { productos } = axios.post(
        "http://localhost:8080/api/mensaje",
        data
      );
    } catch (e) {
      console.log(e);
    }
  });
  //Connection error
  socket.on("connect_error", (err) => {
    console.log(err.message);
  });
});
