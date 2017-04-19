CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE inventory (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(45) NOT NULL,
	department_name VARCHAR(45) NOT NULL,
	price INTEGER(11) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY item_id
);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("baseball cap", "clothing", 10, 50);

-- and so on for other items in table...
