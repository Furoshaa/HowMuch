import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}


// SQL to create the table:
/*
CREATE TABLE IF NOT EXISTS `users` (
	`id` INT AUTO_INCREMENT NOT NULL UNIQUE,
	`username` VARCHAR(255) NOT NULL,
	`firstname` VARCHAR(255) NOT NULL,
	`lastname` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);
*/