const express = require("express");
const PORT = 8080;
const {Server : IOServer}= require("socket.io")
const {Server : HttpServer} = require("http");
const app = express();
const http = new HttpServer(app)
const io = new IOServer(http)
const axios = require("axios");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Contenedor = require("./public/api");
const sqliteOPT = require("../options/sqlite");
const mariaOPT = require("../options/mariaDB")
const contenedorProductos = new Contenedor(mariaOPT, "productos")
const contenedorMensajes = new Contenedor(sqliteOPT, "mensajes")

//Func
const defaultData = async (socket) =>{
  try{
  const productos = await axios.get("http://localhost:8080/producto").then((productos)=>{
    return productos.data
  });
  const mensajes = await axios.get("http://localhost:8080/mensaje").then((msj)=>{
    console.log(msj.data)
    return msj.data
  });
    socket.emit("productosDefault", {
      productos,
      mensajes
    })
  }catch(e){
    console.log(e)
  }
}
//HTTP REQUESTS

const server  = http.listen(PORT, ()=>{
  console.log(`Servidor levantado en ${PORT}`)
})
app.set("view engine", "ejs")  
app.use(express.static(__dirname + "/public"))

app.get("/", (req,res)=>{
    res.render(__dirname + "/views/index.ejs")
})
app.post("/producto", async (req, res)=>{
  const {title, price, thumbnail} = req.body;
  try{
    await contenedorProductos.agregarObj({title, price, thumbnail, timestamp: Date.now()})
    res.send(await contenedorProductos.obtenerAll())
  }catch(e){
    console.log(e)
  }
})
app.post("/mensaje", async (req, res)=>{
  const {user, mensaje} = req.body;
  try{
    await contenedorMensajes.agregarObj({user, mensaje})
    res.send(await contenedorMensajes.obtenerAll())
  }catch(e){
    console.log(e)
  }
})
app.get("/producto", async (req,res)=>{
  const productos  =  await contenedorProductos.obtenerAll();
  res.send(await productos)
})
app.get("/mensaje", async (req, res)=>{
  const mensajes = await contenedorMensajes.obtenerAll();
  res.send(await mensajes)
})
  //SOCKETS
  io.on("connection", function (socket){
    console.log("Usuario conectado")
    defaultData(socket)
    socket.on("new-product", async (data)=>{
      const {title, price, thumbnail} = data;
      const {productos} =  axios.post("http://localhost:8080/producto", 
      {title, price, thumbnail})
      console.log(productos)
      io.sockets.emit("productosNew", {productos})
    })
    socket.on("new-message", async (data)=>{
      const {user, mensaje} = data;
      const {mensajes} = await axios.post("http://localhost:8080/mensaje" ,
      {user, mensaje})
      console.log(mensajes)
      io.sockets.emit("messageNew", {mensajes})
    })
  })