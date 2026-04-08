import express from "express";
import products from "./data/Products.js";
import users from "./data/users.js";
import Product from "./Models/ProductModel.js";
import User from "./Models/UserModel.js";
import asyncHandler from "express-async-handler";

const ImportData = express.Router();

// เปลี่ยนจาก .post เป็น .get
ImportData.get(
    "/user",
    asyncHandler(async (req, res) => {
        await User.deleteMany({}); // ใช้ deleteMany แทน remove (เพราะ remove เลิกใช้ในเวอร์ชันใหม่)
        const importUser = await User.insertMany(users);
        res.send({ importUser });
    })
);

// เปลี่ยนจาก .post เป็น .get
ImportData.get(
    "/products",
    asyncHandler(async (req, res) => {
        await Product.deleteMany({}); // ใช้ deleteMany แทน remove
        const importProducts = await Product.insertMany(products);
        res.send({ importProducts });
    })
);

export default ImportData;
