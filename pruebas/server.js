const express = require("express");
const {Server: HttpServer} = require("http");
const {Server: IOServer} = require("socket.io")
const app = express();
const http = new HttpServer(app);
const io = new IOServer(http);
const PORT = 8080;
app.use(express.static("./public"))
app.get("/",(req,res)=>{
    res.sendFile("index.html", {root: __dirname})
})
http.listen(PORT, (req, res)=>{
    console.log(`Servidor escuchando en ${PORT}`)
})

io.on("connection", (socket)=>{
    console.log("usuario conectado")
})