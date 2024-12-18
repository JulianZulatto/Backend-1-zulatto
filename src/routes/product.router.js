import { Router } from "express";
const router = Router();
import ProductManager from "../components/managers/product-manager.js";

const manager = new ProductManager("./src/data/products.json");

//RUTA PARA LISTAR TODOS LOS PRODUCTOS

router.get("/", async (req, res) => {
    //me gusado el query limit
    let limit = req.query.limit;

    const productos = await manager.getProduct();

    if (limit) {
        res.send(productos.slice(0, limit))
    } else {
        res.send(productos)
    }
})
//RUTA PARA RETORNAR UN PRODUCTO POR ID:
router.get("/:pid", async (req, res) => {
    //siempre se recupera la info de formato string, y el id es number
    let id = req.params.pid;
    const productoBuscado = await manager.getProductById(parseInt(id));
    res.send(productoBuscado);
})

//RUTA QUE DEBE AGREGAR UN NUEVO PRODUCTO CON LOS CAMPOS CORRESPONDIENTES:

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).send({ status: "error", mensaje: "Todos los campos son obligatorios." });
    }

    const arrayProductos = await manager.getProduct();
    if (arrayProductos.some(product => product.code === code)) {
        return res.status(400).send({ status: "error", mensaje: "El código del producto debe ser único." });
    }

    const nuevoProducto = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    try {
        await manager.addProduct(nuevoProducto);
        res.send({ status: "success", mensaje: "Producto creado correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", mensaje: "Error al crear el producto." });
    }
});

//RUTA PUT, SE TOMA UN PRODUCTO Y SE LO ACTUALIZA SIN CAMBIAR NI ELIMINAR EL ID

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;


    const arrayProductos = await manager.getProduct();


    const productoIndex = arrayProductos.findIndex(p => p.id === parseInt(pid));

    if (productoIndex !== -1) {
        arrayProductos[productoIndex].title = title ?? arrayProductos[productoIndex].title;
        arrayProductos[productoIndex].description = description ?? arrayProductos[productoIndex].description;
        arrayProductos[productoIndex].code = code ?? arrayProductos[productoIndex].code;
        arrayProductos[productoIndex].price = price ?? arrayProductos[productoIndex].price;
        arrayProductos[productoIndex].status = status ?? arrayProductos[productoIndex].status;
        arrayProductos[productoIndex].stock = stock ?? arrayProductos[productoIndex].stock;
        arrayProductos[productoIndex].category = category ?? arrayProductos[productoIndex].category;
        arrayProductos[productoIndex].thumbnails = thumbnails ?? arrayProductos[productoIndex].thumbnails;


        await manager.guardarArchivo(arrayProductos);

        res.send({ status: "success", mensaje: "Producto actualizado correctamente." });
    } else {
        res.status(404).send({ status: "error", mensaje: "Producto no encontrado" });
    }
});

//RUTA DELETE, TOMA UN PRODUCTO POR SU ID Y SE ELIMINA 

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    const arrayProductos = await manager.getProduct();

    const productoIndex = arrayProductos.findIndex(p => p.id === parseInt(pid));

    if (productoIndex !== -1) {
        arrayProductos.splice(productoIndex, 1);

        await manager.guardarArchivo(arrayProductos);

        res.send({ status: "success", mensaje: "Producto eliminado correctamente." });
    } else {
        res.status(404).send({ status: "error", mensaje: "Producto no encontrado." });
    }
});

export default router;