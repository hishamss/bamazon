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
        message: "Would you like to proceed ?",
      },
    ])
    .then(function (result) {
      if (result.proceed) {
        buyitem();
      } else {
        console.log("Thank you for using Bamazon");
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
      connection.query(
        "select stock_quantity, price, product_sales from products where item_id = ?",
        result.item,
        function (err, res) {
          if (
            result.quantity > res[0].stock_quantity &&
            res[0].stock_quantity !== 0
          ) {
            console.log("/////////////////////////");
            console.log(
              "Insufficient quantity! Only " +
                res[0].stock_quantity +
                " avaialble"
            );
            console.log("/////////////////////////");
            inquirer
              .prompt([
                {
                  type: "confirm",
                  name: "insufficient",
                  message:
                    "Would you like to proceed buying the available qunatity ?",
                },
              ])
              .then(function (userinput) {
                if (userinput.insufficient) {
                  placeorder(
                    result.item,
                    res[0].stock_quantity,
                    res[0].stock_quantity,
                    res[0].price,
                    res[0].product_sales
                  );
                } else {
                  proceed();
                }
              });
          } else if (res[0].stock_quantity == 0) {
            console.log("Sorry! out of stock");
            proceed();
          } else {
            placeorder(
              result.item,
              res[0].stock_quantity,
              result.quantity,
              res[0].price,
              res[0].product_sales
            );
          }
        }
      );
    });
}

function placeorder(ItemId, CurrentQuan, OrderedQuan, UnitPrice, CurrentSale) {
  var NewQuan = CurrentQuan - OrderedQuan;

  var total = OrderedQuan * UnitPrice;
  var total_sales = Number(CurrentSale) + Number(total);
  console.log("newquan: ", NewQuan, total_sales, ItemId);
  connection.query(
    "update products set stock_quantity = ?, product_sales = ? where item_id = ?",
    [NewQuan, total_sales, ItemId],
    function (err, res) {
      if (err) throw err;
      console.log(res);
      console.log("order has been placed sucsessfully");
      console.log("The total is : $" + total);
      displayall();
    }
  );
}
