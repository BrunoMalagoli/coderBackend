const {options} = require("./options/mariaDB")
const knex = require("knex")(options);

// knex.schema.createTable("cars", (table)=>{
//     //incremental
//     table.increments("id")
//     //varchar
//     table.string("name",200 ) //El numero es lo largo que va a ser el campo
//     //entero
//     table.integer("price", 5)

// })
// .then(()=>{console.log("Tabla creada")})
// .catch((err)=>{console.log(err)})
// .finally(()=>{
//     knex.destroy()
// })
// const carros = [
//     { name: 'Audi', price: 10000 },
//      { name: 'Nissan', price: 80000 },
//     { name: 'Honda', price: 50000 },
//      { name: 'Volvo', price: 90000 },
//     { name: 'Hummer', price: 50000 },
//      { name: 'Ford', price: 30000 },
//    ]

// knex("cars").insert(carros)
// .then(()=>{console.log("Tabla insertada")})
// .catch((err)=>{console.log(err)})
// .finally(()=>{
//     knex.destroy()
// })

// knex.from("cars").select("*").then((data)=>{
//     for(registro of data){
//         console.log(`${registro.id} ${registro.name} ${registro.price}`)
//     }
// })
// .catch((err)=>{
//     console.log(err)
// })
// .finally(()=>{
//     knex.destroy()
// })
knex.from("cars").where("price", ">=", 50000).orderBy("price").select("*").then((data)=>{
    for(registro of data){
        console.log(`${registro.id} ${registro.name} ${registro.price}`)
    }
})
.catch((err)=>{
    console.log(err)
})
.finally(()=>{
    knex.destroy()
})