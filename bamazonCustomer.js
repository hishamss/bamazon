require("console.table");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon",
});

connection.connect(function (err) {
  if (err) throw err;
  afterconnect();
});

function afterconnect() {
  connection.query("select * from products", function (err, res) {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
}
