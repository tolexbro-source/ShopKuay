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

// 4. API Routes (ต้องอยู่ข้างบนสุดเพื่อให้เรียกใช้งานได้ก่อนหน้าเว็บ)
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

// --- 5. ส่วนเชื่อมต่อ Frontend (ย้าย Error Handling ไปไว้หลังส่วนนี้) ---
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    // ใช้ ".." ถอยออกจาก Server ไปหา Frontend ตามโครงสร้างไฟล์จริง
    const frontendBuildPath = path.join(__dirname, "..", "Frontend", "build");
    
    app.use(express.static(frontendBuildPath)); 

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendBuildPath, "index.html"));
    });
} else {
    // แก้ไขให้ Root ทำงานได้ทั้งคู่ตอนรันเครื่องตัวเอง
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

// 6. Error Handling Middlewares (ต้องอยู่หลังสุดหลังจากเช็ค Route ทั้งหมดแล้ว)
app.use(notFound);
app.use(errorHandler);

// 7. Start Server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
