import express, { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/productPS3.controller";

const router: Router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;