import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { ProductPS3 } from '../models/productPS3.model';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const db = await connectDB();
        const [rows] = await db.execute<ProductPS3[]>('SELECT * FROM products_ps3');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching products:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const db = await connectDB();
        const [product] = await db.execute<ProductPS3[]>(
            'SELECT * FROM products_ps3 WHERE id = ?',
            [id]
        );

        if (!product[0]) {
            res.status(404).json({ success: false, message: "Product not found" });
        } else {
            res.status(200).json({ success: true, data: product[0] });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching product:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Create function
export const createProduct = async (req: Request, res: Response) => {
    const product = req.body;

    if(!product.name || !product.price || !product.image) {
        res.status(400).json({ success: false, message: 'Please fill all fields' });
    } else {
        try {
            const db = await connectDB();
            const [result] = await db.execute(
                'INSERT INTO products_ps3 (name, price, image) VALUES (?, ?, ?)',
                [product.name, product.price, product.image]
            );
            
            const [newProduct] = await db.execute<ProductPS3[]>(
                'SELECT * FROM products_ps3 WHERE id = ?',
                [(result as any).insertId]
            );

            res.status(201).json({ success: true, data: newProduct[0] });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error in Create product:", error.message);
            }
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = req.body;

    try {
        const db = await connectDB();
        await db.execute(
            'UPDATE products_ps3 SET name = ?, price = ?, image = ? WHERE id = ?',
            [product.name, product.price, product.image, id]
        );

        const [updatedProduct] = await db.execute<ProductPS3[]>(
            'SELECT * FROM products_ps3 WHERE id = ?',
            [id]
        );

        if (!updatedProduct[0]) {
            res.status(404).json({ success: false, message: "Product not found" });
        } else {
            res.status(200).json({ success: true, data: updatedProduct[0] });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error updating product:", error.message);
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const db = await connectDB();
        const [result] = await db.execute('DELETE FROM products_ps3 WHERE id = ?', [id]);
        
        if ((result as any).affectedRows === 0) {
            res.status(404).json({ success: false, message: "Product not found" });
        } else {
            res.status(200).json({ success: true, message: "Product deleted" });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in deleting product:", error.message);
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};
