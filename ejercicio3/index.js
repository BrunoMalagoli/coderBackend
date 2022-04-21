const fs = require("fs")
class Contenedor{
    constructor(fileName){
    this.fileName = fileName;
    this.arrayProduct = [];
    }
  async save(fileObj){
      const producto = fileObj;
    try{
        this.arrayProduct.push(producto)
        producto.id = this.arrayProduct.length
        await fs.promises.writeFile(
            `./${this.fileName}`
            , `${JSON.stringify(this.arrayProduct)}`
            , error=>{
        if(error){
                throw new Error(error.message)
            }
            })
        }
        catch(error){
            console.error(error)
        }
        return producto.id
    }
    async getById(id){
        try{
            let data = await fs.promises.readFile(`./${this.fileName}`, "utf-8")
            data = JSON.parse(data)
            const dataFiltered = await data.filter((products)=> products.id === id)
            console.log(JSON.stringify(dataFiltered))
            return dataFiltered
            
        }catch(err){
            console.log(err)
        }
    }
    async getAll(){
        try{
            const allContent = await fs.promises.readFile(`./${this.fileName}`, "utf-8", (error)=>{
                if(error){
                    throw new Error(error.message);
                }
            })
            console.log(allContent)
            return allContent
        }
        catch{
           console.error(Error()) 
        }
    }
    async deleteById(id){
        try{
            let data = await fs.promises.readFile(`./${this.fileName}`, "utf-8")
            data = JSON.parse(data)
            let dataFiltered = data.filter((prod)=>prod.id !== id)
            let dataExcluded = await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(dataFiltered) ,"utf-8")
            console.log(dataFiltered)
            return dataExcluded
        }catch{
            console.log(Error)
        }
    }
    async deleteAll(){
        try{
            await fs.promises.writeFile(`./${this.fileName}`,"", (error)=>{
                if(error){
                    throw new Error(error.message)
                }else{
                    console.log("Se eliminó todo el contenido!")
                }
            })
        }
        catch{
            console.error(Error)
        }
    }
}
const container = new Contenedor("productos.txt")
const prod1 = {
    title: "Escuadra",
    price : 7.21,
    thumbnail : "https://images.unsplash.com/photo-1529651795107-e5a141e34843?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
}
const prod2 = {
    title: "Regla",
    price : 220.21,
    thumbnail : "https://images.unsplash.com/photo-1529651795107-e5a141e34843?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
}
const prod3 = {
    title: "Globo Terráqueo",
    price: 345.67,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
}
container.save(prod1)
container.save(prod2)
container.save(prod3)
//container.getAll()
//container.getById(1)
//container.deleteById(1)
//container.deleteAll()

module.exports = Contenedor;