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
  promptmanager();
});

function promptmanager() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "options",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit",
        ],
      },
    ])
    .then(function (result) {
      switch (result.options) {
        case "View Products for Sale":
          displayall();
          break;
        case "View Low Inventory":
          lowenventory();
          break;
      }

      connection.end();
    });
}

function displayall() {
  connection.query("select * from products", function (err, res) {
    if (err) throw err;
    console.table(res);
    promptmanager();
  });
}

function lowenventory() {
  connection.query("select * from products where stock_quantity<5", function (
    err,
    res
  ) {
    if (err) throw err;
    console.table(res);
    promptmanager();
  });
}
