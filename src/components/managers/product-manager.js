import { promises as fs } from "fs";


class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;

        // La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
    }

    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {

        //yo puedo leer el archivo y guardarme el array con los productos
        const arrayProductos = await this.leerArchivo();



        //validamos que se agregaron todos los campos:
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            console.log("Todos los campos son obligatorios.");
            return
        }

        //validamos que el code sea unico:
        //el some te retorna un verdadero o falso
        if (arrayProductos.some(item => item.code === code)) {
            console.log("El codigo debe ser unico")
            return
        }

        //si pasamos las dos validaciones, ahora podemos crear el objeto:

        const nuevoProducto = {
            id: ++ProductManager.ultId, //con esto le asigno de manera automatica un id que autoincrementa
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        }

        //una vez que lo puedo crear lo pusheo al array
        arrayProductos.push(nuevoProducto);

        //una vez que agregamos el nuevo producto al array, guardamos el array al archivo:
        await this.guardarArchivo(arrayProductos);
    }
    async getProduct() {
        const arrayProductos = await this.leerArchivo();
        return arrayProductos;

    }
    async getProductById(id) {
        //primero leo el archivo y genero el array:
        const arrayProductos = await this.leerArchivo();
        const producto = arrayProductos.find(item => item.id === id);

        if (!producto) {
            return "Not Found";
        } else {
            return producto;
        }

    }
    //se pueden armar unos metodos auxiliares que guarden el archivo y recuperen los datos:

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Tenemos un error al guardar el archivo");
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos
        } catch (error) {
            console.log("Tenemos un error al leer el archivo");
        }
    }
}

export default ProductManager;