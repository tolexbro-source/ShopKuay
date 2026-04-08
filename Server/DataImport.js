import express from "express";
import products from "./data/Products.js";
import users from "./data/users.js";
import Product from "./Models/ProductModel.js";
import User from "./Models/UserModel.js";
import asyncHandler from "express-async-handler";

const ImportData = express.Router();

// นำเข้า User: https://shopkuay.onrender.com/api/import/user
ImportData.get("/user", asyncHandler(async (req, res) => {
    await User.deleteMany({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
}));

// นำเข้าสินค้า: https://shopkuay.onrender.com/api/import/products
ImportData.get("/products", asyncHandler(async (req, res) => {
    await Product.deleteMany({}); 
    const importProducts = await Product.insertMany(products);
    res.send({ importProducts });
}));

export default ImportData;
