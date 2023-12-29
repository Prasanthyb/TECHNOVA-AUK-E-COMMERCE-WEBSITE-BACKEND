const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');
const db = require('./config/db');

// Load ENV variables
dotenv.config({ path: './config/config.env' });

// Load Models
const Product = require('./models/Product');


// Connect to Mongo Database
const dbConnection = db.connectToDatabase();

// Read The JSON files
const products = JSON.parse(fs.readFileSync(`${__dirname}/_seedData/products.json`, 'utf-8'));


// Import Sample Data In DB
const importData = async () => {
    try {
        await Product.create(products);
      
        console.log(`Data successfully imported`.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete all data from DB
const deleteAllData = async () => {
    try {
        await Product.deleteMany({});
       
        console.log(`All data successfully deleted`.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};



// Handle command-line arguments
const command = process.argv[2];

switch (command) {
    case '-i':
        importData().then();
        break;
    case '-d':
        deleteAllData().then();
        break;
    default:
        console.log('Invalid command. Use -i to import or -d to delete.');
        process.exit(1);
}