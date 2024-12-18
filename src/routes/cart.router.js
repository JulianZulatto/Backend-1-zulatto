import { Router } from "express";
const router = Router();
import CartManager from "../components/managers/carts-manager.js";

const manager = new CartManager("./src/data/carts.json");

//1) crear un nuevo carrito:

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ error: "Error al intentar crear un carrito" })
    }
})

//2) Listamos los productos que pertenecen a determinado carrito

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const carritoBuscado = await manager.getCarritoById(cartId);
        res.json(carritoBuscado.products)
    } catch (error) {
        res.status(500).json({ error: "Error" })
    }
})



//3) Agregar productos al carrito:

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await manager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (Error) {
        res.status(500).json({ error: "Error" });
    }
})

export default router;