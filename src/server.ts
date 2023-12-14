import dotenv from "dotenv";
dotenv.config();
import https from "https"
import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
// import swaggerDocs from './swagger';
// routes
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import roleRoutes from "./routes/role.routes";
import orderRoutes from "./routes/order.routes";
import roomRoutes from "./routes/room.routes";
import productInOrderRoutes from "./routes/productinorder.routes";
// create role admin
import { createRoleAdminWaiter } from "./middlewares/user.middleware";
createRoleAdminWaiter();

const app = express();
const port = +process.env.PORT! || 3000;

const userAgent = new https.Agent({
  rejectUnauthorized: false
})

app.use(cors({ origin: '*', methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']}));
app.use(express.json());
app.options('*', (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Origin", "*")
  res.header("User-Agent", "*")
  res.header("Agent", "*")
})
app.use(express.urlencoded({ extended: true}))

app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/productinorder', productInOrderRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
