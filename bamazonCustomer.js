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
    proceed();
  });
}

function proceed() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "proceed",
        message: "Would you like to buy ?",
      },
    ])
    .then(function (result) {
      if (result.proceed) {
        buyitem();
      } else {
        console.log("Thank you for shopping with us");
        connection.end();
        process.exit();
      }
    });
}

function buyitem() {
  inquirer
    .prompt([
      {
        name: "item",
        message: "please type the item id you would like to buy ?",
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
        "select stock_quantity, price, product_sales from products where item_id = ?",
        result.item,
        function (err, res) {
          if (result.quantity > res[0].stock_quantity) {
            console.log("/////////////////////////");
            console.log(
              "Insufficient quantity! Only " +
                res[0].stock_quantity +
                " avaialble"
            );
            console.log("/////////////////////////");
            proceed();
          } else {
            var NewQuan = res[0].stock_quantity - result.quantity;
            var total = result.quantity * res[0].price;
            var total_sales = Number(res[0].product_sales) + Number(total);
            connection.query(
              "update products set stock_quantity = ?, product_sales = ? where item_id = ?",
              [NewQuan, total_sales, result.item],
              function (err, res) {
                if (err) throw err;
                console.log("order has been placed sucsessfully");
                console.log("The total is : $" + total);
                displayall();
              }
            );
          }
        }
      );
    });
}
