const socket = io.connect()
socket.on("mensaje", (data)=>{
    console.log(data)
})
function render(data){
    let html = data.map((producto)=>{
        return `
        <tr>
        <th>${producto.id}</td>
        <td>${producto.title}</td>
        <td>${producto.price}</td>
        <td>${producto.thumbnail}</td>
        </tr><br>`
    }).join(" ")
    document.getElementById("table-body").innerHTML=  html
}
function renderMessages(data){
    let chat = data.map((mensaje)=>{
        return `
        <span><b>${mensaje.user}</b> (${mensaje.timestamp}): ${mensaje.mensaje}</span><br>
        ` 
    }).join(" ")
    document.getElementById("chat").innerHTML= chat
}
socket.on("productosDefault", ({productos, mensajes})=>{
    render(productos)
    renderMessages(mensajes)
})
socket.on("productosNew", (data)=>{
    render(data)
})
socket.on("messageNew", (data)=>{
    renderMessages(data)
})
function newProduct(){
    const producto = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("image").value
    }
    socket.emit("new-product", producto)
    return false
}

function newMessage(){
    const mensaje = {
        user: document.getElementById("usuario").value,
        mensaje: document.getElementById("mensaje").value
    }
    socket.emit("new-message", mensaje)
}