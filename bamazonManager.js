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
        case "Add to Inventory":
          addtoinventory();
          break;
      }

      //   connection.end();
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

function addtoinventory() {
  inquirer
    .prompt([
      {
        name: "item",
        message: "For which item id you would like to add more quantity ?",
        validate: function (value) {
          // accept only integer numbers
          if (Number.isInteger(Number(value))) {
            return true;
          }
          return false;
        },
      },
      {
        name: "quantity",
        message: "Please Enter the quantity?",
        validate: function (value) {
          // accept only integer numbers
          if (Number.isInteger(Number(value))) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (result) {
      connection.query(
        "select stock_quantity from products where item_id = ?",
        result.item,
        function (err, res) {
          if (err) throw err;
          var NewQuan = Number(res[0].stock_quantity) + Number(result.quantity);
          connection.query(
            "update products set stock_quantity = ? where item_id = ?",
            [NewQuan, result.item],
            function (err, res) {
              if (err) throw err;
              console.log("new qunatity has been added successfully");
              promptmanager();
            }
          );
        }
      );
      ///////////////////
    });
}
