import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import connectDatabase from "./config/MongoDB.js";
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import categoryRouter from "./Routes/CategoryRoutes.js";
import orderRouter from "./Routes/OrderRoutes.js";
import productRouter from "./Routes/ProductRoutes.js";
import uploadRouter from "./Routes/UploadRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to MongoDB
connectDatabase();

const app = express();

// 3. Middlewares
app.use(express.json()); 
app.use(cors());         
app.use(
    fileUpload({
        useTempFiles: true, 
    })
);

// 4. API Routes
app.use("/api/import", ImportData);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

// PayPal Config Endpoint
app.get("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || "sb"); 
});

// Root API Check 
app.get("/", (req, res) => {
    res.send("API is running...");
});

// 5. Error Handling Middlewares 
app.use(notFound);
app.use(errorHandler);

// 6. Start Server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
