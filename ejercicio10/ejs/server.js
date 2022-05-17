const express = require("express");
const PORT = 8080;
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const faker = require("faker");
const app = express();
const http = new HttpServer(app);
const io = new IOServer(http);
const axios = require("axios");
const { MongoClient } = require("mongodb");
const URL = require("../.env/dbOpt");
const client = new MongoClient(URL);
const { schema, normalize, denormalize } = require("normalizr");
const util = require("util");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let productos = [];
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
let lastMessageId;
app.post("/api/mensaje", async (req, res) => {
  try {
    const mensajes = req.body;
    const newMensajes = { id: "mensajes", mensajes };
    const normalizado = normalize(newMensajes, msjSchema);
    await client.connect();
    const database = client.db("ejercicio22");
    const coll = database.collection("messages");
    const messageID = await coll.insertOne(normalizado);
    lastMessageId = JSON.stringify(messageID.insertedId);
    io.sockets.emit("messageNew", normalizado);
    console.log(`Normalizado : ${JSON.stringify(normalizado).length}`);
  } catch (e) {
    console.log(e);
  } finally {
    client.close();
  }
});
app.post("/api/mensaje-desnormalizado", async (req, res) => {
  let mensajeNormalizado = req.body;
  try {
    const denormalizado = denormalize(
      mensajeNormalizado.result,
      msjSchema,
      mensajeNormalizado.entities
    );
    res.send(denormalizado);
  } catch (e) {
    console.log(e);
  }
});
app.get("/api/mensajes-desnormalizados", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("ejercicio22");
    const coll = database.collection("messages");
    const normalizado = await coll.find({}, { sort: { _id: -1 } });
    const denormalizado = denormalize(
      normalizado.result,
      msjSchema,
      normalizado.entities
    );
    res.send(denormalizado);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
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
  io.sockets.emit("initialMessages");
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
