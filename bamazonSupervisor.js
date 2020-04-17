require("console.table");
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon",
});

connection.connect(function (err) {
  if (err) throw err;
  promptsupervisor();
});

function promptsupervisor() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "options",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "Exit",
        ],
      },
    ])
    .then(function (result) {
      if (result.options === "View Product Sales by Department") {
        var sql =
          "select custom1.department_id, custom1.department_name, custom1.over_head_costs, custom1.product_sales, (custom1.over_head_costs - custom1.product_sales) as total_profit from (select departments.department_id, departments.department_name, departments.over_head_costs, custom.product_sales from departments inner join (select department_name, sum(product_sales) as product_sales from products group by department_name) as custom on departments.department_name = custom.department_name) as custom1";
        connection.query(sql, function (err, res) {
          if (err) throw err;
          console.table(res);
          promptsupervisor();
        });
      } else if (result.options === "Create New Department") {
        ///////////////
        inquirer
          .prompt([
            {
              name: "department_name",
              message: "Department Name: ",
            },
          ])
          .then(function (result) {
            connection.query(
              "insert into departments set ?",
              {
                department_name: result.department_name,
                //  random value between 2000 to 6000
                over_head_costs: Math.floor(Math.random() * 4000) + 2000,
              },
              function (err, res) {
                if (err) throw err;
                console.table("department has been created successfully");
                promptsupervisor();
              }
            );
          });
        ////////////////
      } else {
        connection.end();
        process.exit();
      }
    });
}
