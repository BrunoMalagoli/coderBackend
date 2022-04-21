const socket = io.connect();

socket.on("mensaje",(data)=>{
    render(data)
})