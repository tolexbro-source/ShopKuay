import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import path from "path"; 
import connectDatabase from "./config/MongoDb.js"; 
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import categoryRouter from "./Routes/CategoryRoutes.js";
import orderRouter from "./Routes/OrderRoutes.js";
import productRouter from "./Routes/ProductRoutes.js";
import uploadRouter from "./Routes/UploadRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

// 1. Configuration
dotenv.config();
connectDatabase();

const app = express();

// 2. Middlewares
app.use(express.json()); 
app.use(cors());         
app.use(
    fileUpload({
        useTempFiles: true, 
    })
);

// 3. API Routes (ส่วนสำคัญที่ทำให้สินค้าขึ้น)
app.use("/api/import", ImportData); // อย่าลืมแก้ DataImport.js เป็น .get ด้วยนะครับ
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

// PayPal Config
app.get("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || "sb"); 
});

// 4. Static Files & Deployment Setup
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    // ชี้ไปที่โฟลเดอร์ build ของ Frontend (หน้าบ้านลูกค้า)
    const frontendBuildPath = path.join(__dirname, "..", "Frontend", "build");
    
    app.use(express.static(frontendBuildPath)); 

    // รองรับ Single Page Application (React Router)
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendBuildPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running smoothly...");
    });
}

// 5. Error Handling (ต้องอยู่หลังสุดเสมอ)
app.use(notFound);
app.use(errorHandler);

// 6. Start Server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
