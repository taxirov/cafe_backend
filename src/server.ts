import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import https from 'https'
import fs from 'fs'
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

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY!);
const certificate = fs.readFileSync(process.env.CERTIFICATE!);

const credentials = {key: privateKey, cert: certificate};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

const port = +process.env.PORT! || 3000;

app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/productinorder', productInOrderRoutes)

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});