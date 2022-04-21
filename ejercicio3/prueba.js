const Contenedor = require("./index")
const container = new Contenedor("productos.txt");
const main = async() =>{
    console.log("inicio de prueba")
    const prod1 = await container.save(
    {
    title: "Escuadra",
    price : 7.21,
    thumbnail : "https://images.unsplash.com/photo-1529651795107-e5a141e34843?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    })
        const prod2 = await container.save(
    {
    title: "Regla",
    price : 220.21,
    thumbnail : "https://images.unsplash.com/photo-1529651795107-e5a141e34843?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    })
    await container.getById(1)
    await container.getById(2)
    await container.getAll()
    await container.deleteById(2)
    await container.deleteAll();
}
    main()