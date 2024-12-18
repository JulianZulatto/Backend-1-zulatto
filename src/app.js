import express from "express";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";

const app = express();
const PUERTO = 8080;

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);



//Listen
app.listen(PUERTO, () => {
    console.log(`Escuchando el puerto: ${PUERTO}`);
})