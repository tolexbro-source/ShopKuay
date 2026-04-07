import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import path from "path"; // 1. ย้ายขึ้นมาไว้ด้านบน
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

// 4. API Routes (ต้องอยู่ก่อนส่วนของ Frontend)
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

// --- 5. ส่วนเชื่อมต่อ Frontend (เพิ่มตรงนี้) ---
const __dirname = path.resolve();

// ถ้าเป็นการรันบน Production (Render)
if (process.env.NODE_ENV === "production") {
    // ชี้ไปที่โฟลเดอร์ build ของ Frontend (ก้าวออกมา 1 ชั้นจาก Server)
    app.use(express.static(path.join(__dirname, "../Frontend/build"))); 

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "Frontend", "build", "index.html"));
    });
} else {
    // ถ้าไม่ได้รันบน production ให้โชว์คำว่า API is running ปกติ
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

// 6. Error Handling Middlewares (ต้องอยู่หลัง Routes ทั้งหมด)
app.use(notFound);
app.use(errorHandler);

// 7. Start Server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
