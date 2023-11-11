import dotenv from "dotenv";
dotenv.config()

import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes"
import productRoutes from "./routes/product.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});