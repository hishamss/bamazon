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
        case "Add New Product":
          addnewproduct();
          break;
        default:
          quit();
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

function addnewproduct() {
  inquirer
    .prompt([
      {
        name: "product_name",
        message: "Product Name: ",
      },
      {
        name: "department_name",
        message: "Department Name: ",
      },
      {
        name: "price",
        message: "Price in dollars: ",
        validate: function (value) {
          //accept number only
          if (isNaN(value)) {
            return false;
          }
          return true;
        },
      },
      {
        name: "stock_quantity",
        message: "Quantity: ",
        validate: function (value) {
          if (Number.isInteger(Number(value))) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (result) {
      connection.query(
        "insert into products set ?",
        {
          product_name: result.product_name,
          department_name: result.department_name,
          price: result.price,
          stock_quantity: result.stock_quantity,
        },
        function (err, res) {
          if (err) throw err;
          console.log("Added successfully");
          promptmanager();
        }
      );
    });
}

function quit() {
  connection.end();
  process.exit();
}
