create database bamazon;
use bamazon;

create table products (
item_id INT not null auto_increment,
product_name varchar(30) not null,
department_name varchar(30) not null,
price decimal(6, 2) not null,
stock_quantity INT not null,
PRIMARY KEY (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ('detergent', 'grocery', '19.97', '3'),
('trash bags', 'grocery', '15.97', '10'),
('ice maker', 'electronics', '199.99', '2'),
('blender', 'electronics', '29.99', '5'), 
('car seat', 'baby', '349.99', '1'),
('formula', 'baby', '35.00', '3'),
('jeans', 'clothes', '145.60', '20'),
('shoes', 'clothes', '114.95', '15');