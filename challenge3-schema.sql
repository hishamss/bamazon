alter table products add product_sales decimal(10,2);

create table departments (
department_id INT not null auto_increment,
department_name varchar(30) not null,
over_head_costs INT,
PRIMARY KEY (department_id)
);