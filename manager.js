// JS FOR BAMAZON MANAGER FUNCTIONALITIES

// dependencies and mysql connection
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "", // your password
    database: "bamazon"
});

// function that shows inventory to manager on load
function manager() {

    connection.query("SELECT * FROM inventory", function(err, res) {
        if (err) throw err;

        var mgrTable = new Table({

            head: ["Item ID", "Product Name", "Department", "Price", "Stock Quantity"]
        });

        for (i = 0; i < res.length; i++) {

            mgrTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        // logging the completed table to console
        console.log(mgrTable.toString());
        manageStore();
    });
};

// function that prompts manager to manage the store
function manageStore() {

    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Choose an option below to manage your store:",
        choices: ["Restock Inventory", "Add New Product", "Remove An Existing Product"]
    }]).then(function(answers) {

        switch (answers.action) {

            case "Restock Inventory":
                restockRequest();
                break;

            case "Add New Product":
                addRequest();
                break;

            case "Remove An Existing Product":
                removeRequest();
                break;
        }
    });
};

// function if the manager wants to restock an item
function restockRequest() {
    // gathers data from manager for restock
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the item ID of the product you wish to restock?"
        }, {
            name: "quantity",
            type: "input",
            message: "How many would you like to add?"
        },

    ]).then(function(answers) {

        var quantityAdded = answers.quantity;
        var productId = answers.ID;
        restockDatabase(productId, quantityAdded);
    });
}; 

// runs when the mamager restocks an item
function restockDatabase(id, quant) {

    connection.query("SELECT * FROM inventory WHERE item_id = " + id, function(err, res) {
        if (err) throw err;
        connection.query("UPDATE inventory SET stock_quantity = stock_quantity + " + quant + " WHERE item_id = " + id);
        console.log("Item successfully restocked!");

        manager();
    });
}; 

// function for if the manager wants to add an item
function addRequest() {
    inquirer.prompt([

        {
            name: "name",
            type: "input",
            message: "What is the name of the item you wish to stock?"
        },
        {
            name: "department",
            type: "input",
            message: "What department does this product belong in?"
        },
        {
            name: "price",
            type: "input",
            message: "How much would you like this to cost?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to add?"
        },

    ]).then(function(answers) {

    	var name = answers.name;
    	var dept = answers.department;
    	var price = answers.price;
    	var quantity = answers.quantity;
    	addNewItem(name, dept, price, quantity);
    });
};

// runs when the manager adds a new item
function addNewItem(name, dept, price, quantity) {

	connection.query("INSERT INTO inventory (product_name, department_name, price, stock_quantity) VALUES('" + name + "', '" + dept + "', " + price + ", " + quantity + ")");
    console.log("New product successfully added!");

	manager();

};

// function for if the manager wants to remove an item
function removeRequest(){
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "What is the item number of the item you wish to remove?"
        }]).then(function(answer){
        	var id = answer.ID;
        	removeFromDatabase(id);
        });
};

// runs when the manager removes an item
function removeFromDatabase(id){
	connection.query("DELETE FROM inventory WHERE item_id = " + id);
    console.log("Product was removed from inventory!");
	manager();
};

// run the manager function when the file is loaded to prompt the user
manager();