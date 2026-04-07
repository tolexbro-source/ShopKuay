import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import path from "path"; // 1. Import path
import { fileURLToPath } from "url"; // Required for ES modules
import connectDatabase from "./config/MongoDB.js";
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import categoryRouter from "./Routes/CategoryRoutes.js";
import orderRouter from "./Routes/OrderRoutes.js";
import productRouter from "./Routes/ProductRoutes.js";
import uploadRouter from "./Routes/UploadRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());
app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true, 
    })
);

// --- API ROUTES ---
app.use("/api/import", ImportData);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.get("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

// --- DEPLOYMENT SETTINGS (From your image) ---

// 1. Serve Admin App
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('/admin/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// 2. Serve Customer App
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});

// --- ERROR HANDLE ---
// Note: error handlers should stay at the bottom
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;
app.listen(PORT, console.log(`Server run in port ${PORT}`));
