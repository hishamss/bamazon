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
  displayall();
});

function displayall() {
  connection.query("select * from products", function (err, res) {
    if (err) throw err;
    console.table(res);
    buyitem();
  });
}

function buyitem() {
  inquirer
    .prompt([
      {
        name: "item",
        message: "please type the item id you would like to buy",
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
        message: "Please enter the quantity?",
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
      console.log(result.item, result.quantity);
      connection.query(
        "select stock_quantity from products where item_id = ?",
        result.item,
        function (err, res) {
          if (result.quantity > res[0].stock_quantity) {
            console.log(
              "Insufficient quantity! Only " +
                res[0].stock_quantity +
                " avaialble"
            );
          } else {
            var NewQuan = res[0].stock_quantity - result.quantity;
            connection.query(
              "update products set stock_quantity = ? where item_id = ?",
              [NewQuan, result.item],
              function (err, res) {
                if (err) throw err;
                console.log("order has been placed sucsessfully");
              }
            );
          }
        }
      );
    });
}
