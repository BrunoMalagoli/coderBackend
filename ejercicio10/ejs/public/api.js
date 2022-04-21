const knex = require("knex")
class Contenedor{
    constructor(configObj, tableName){
        this.configObj = configObj;
        this.tableName = tableName;
    }

    async crearTabla(){
        const db = knex(this.configObj);
        const tableName = this.tableName;
        try{
            if(tableName == "productos"){
            await db.schema.createTable(tableName, (table)=>{
                table.increments("id");
                table.bigInteger("timestamp");
                table.string("title");
                table.float("price");
                table.text("thumbnail")
                })
            }else if(tableName == "mensajes"){
            await db.schema.createTable(tableName, (table)=>{
                table.increments("id");
                table.bigInteger("timestamp");
                table.string("mensaje");
                table.string("user");
                })
            }else{
                throw new Error();
            }
        }
        catch(err){
            console.log(err)
        }finally{
           await db.destroy();
        }
    }
    async agregarObj(objAgregado){
        const db = knex(this.configObj);
        try{
    return await db(this.tableName).insert({...objAgregado, timestamp: Date.now()})
        }catch(err){
            console.log(err)
        }finally{
            db.destroy();
        }
    }
    async obtenerObj(id){
        const db = knex(this.configObj)
        try{
    return await db(this.tableName)
            .select("*")
            .where("id", id);
        }
        catch(err){
            console.log(err)
        }
        finally{
            db.destroy();
        }
    }
    async obtenerAll(){
        const db = knex(this.configObj)
        try{
    return await db(this.tableName)
            .select("*")
        }
        catch(err){
            console.log(err)
        }
        finally{
            db.destroy();
        }
    }
    async editarObj(id, newObj){
        const db = knex(this.configObj);
        try{
        return await db(this.tableName)
            .where("id", id)
            .update({...newObj, timestamp: Date.now()})
        }
        catch(err){
            console.log(err)
        }
        finally{
            db.destroy();
        }
    }
    async eliminarObj(id){
        const db = knex(this.configObj);
        try{        
        return await db(this.tableName)
        .where("id", id)
        .del()
        }   
        catch(err){
            console.log(err)
        }
        finally{
            db.destroy();
        }
    }
}
module.exports = Contenedor;