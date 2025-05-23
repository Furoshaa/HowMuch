import { RowDataPacket } from 'mysql2';

export interface ProductPS3 extends RowDataPacket {
    id: number;
    name: string;
    price: number;
    image: string;
    created_at: Date;
    updated_at: Date;
}

// SQL to create the table:
/*
CREATE TABLE products_PS3 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/