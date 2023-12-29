const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    price:{
        type: Number,
        required: [true, 'Please enter a price']
    },
    feature: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.9,
    },
    company:{
        type:String,
        enum:{
            values:["apple","samsung","dell","mi"],
            message:`{VALUE} is not supported`,
        }
    }
},{timestamps:true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
