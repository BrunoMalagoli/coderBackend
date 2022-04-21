class Usuario{
    constructor( nombre, apellido ){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = [];
        this.mascotas = [];
    }
    getFullName(){
        return (`${this.nombre} ${this.apellido}`);
    }
    addMascota(mascota){
        return this.mascotas.push(mascota)
    }
    countMascotas(){
        return this.mascotas.length
    }
    addBook( libro, escritor ){
        return this.libros.push({nombre: libro, autor: escritor })
    }
    getBookNames(){
        return this.libros.map((libro) => libro.nombre);
    }
}

const Bruno = new Usuario("Bruno","Malagoli");
Bruno.getFullName();
Bruno.addMascota("Gato");
Bruno.addMascota("Perro");
Bruno.countMascotas();
Bruno.addBook("El Quijote","Miguel Cervantes");
Bruno.getBookNames();