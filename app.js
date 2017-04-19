// JS FOR BAMAZON CUSTOMER FUNCTIONALITY

// dependencies and connection for mysql
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({

  host: "localhost",
  port: 3306,
  user: "root",
  password: "44RvXf2pAhfoHWMs",
  database: "bamazon"

});

connection.connect(function(err) {

  if (err) throw err;

  console.log("Connected as ID: " + connection.threadId);

});

// function to start bamazon and display inventory
var start = function() {
  
	connection.query("SELECT * FROM inventory", function(err, res) {
		if (err) throw err;

		// creates a table
		var table = new Table({
			head: ["Item ID", "Product Name", "Department", "Price", "Stock Quantity"]
		});

		// displays all items for sale
		console.log("Welcome to Bamazon! Here's a view of our inventory: ");
		console.log("====================================================");
		for (var i = 0; i < res.length; i++) {
			table.push([res[i].item_id, res[i].product_name, res[i].department_name,
				res[i].price, res[i].stock_quantity]);
		}
		console.log(table.toString());
		inquirer.prompt([
		{
			name: "itemId",
			type: "input",
			message: "What is the item ID of the product you would like to purchase?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				} else {
					return false;
				}
			}
		}, {
			name: "quantity",
			type: "input",
			message: "How many of this product would you like to buy?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				} else {
					return false;
				}
			}
		}
			]).then(function(answers) {
				var chosenId = answers.itemId;
				var chosenQuantity = answers.quantity;
				purchase(chosenId, chosenQuantity);
		});
	});
};

function purchase(ID, quantityNeeded) {

	connection.query("SELECT * FROM inventory WHERE item_id = " + ID, function (err, res) {
		if (err) throw err;

		if (quantityNeeded <= res[0].stock_quantity) {
			var totalCost = res[0].price * quantityNeeded;

			console.log("We have what you need!");
			console.log("Your total cost is $" + totalCost + ". Thank you for your purchase!");

			connection.query("UPDATE inventory SET stock_quantity = stock_quantity - " + quantityNeeded + " WHERE item_id = " + ID);
		} else {
			console.log("Our apologies. We don't have enough of that item to fulfill your order.");
		};
		start();
	})
}


// run the start function when the file is loaded to prompt the user
start();