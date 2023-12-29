const Product = require('../models/Product');
const CustomError = require("../utilities/CustomError");


// ~~~~~~~~~~~~~GET ALL PRODUCTS FROM products COLLECTION~~~~~~~~~~~~~~~

const getAllProducts = async (req, res) => {

   //~~~~~~~~~~~~~~~~~~~~~~~~ FILTERING~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  try {
    const { company, name,feature,sort,select} = req.query;

    const queryObject = {};
    if (company) {
      queryObject.company = company;
    }
    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }
    if (feature) {
      queryObject.feature = feature;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~SORTING~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    let apiData=Product.find(queryObject)
    if (sort) {
      let sortFix=sort.split(",").join(" ");
      apiData=apiData.sort(sortFix);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~SELECT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if (select) {
      let selectFix=select.split(",").join(" ");
      apiData=apiData.select(selectFix);
    }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PAGINATION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    let page=Number(req.query.page) || 1;
    let limit=Number(req.query.limit) || 10;
    let skip=(page-1)*limit

    apiData=apiData.skip(skip).limit(limit);

    const Products = await apiData;
    if (!Products || Products.length === 0) {
      const error = new CustomError(`Something went wrong, try again later.`, 500);
      return res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    }
    res.status(200).json({
      // success: true,
      // count: Products.length,
      // Productsucts: Products
     Products,nbHits:Products.length

    });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    const customError = new CustomError(`Something went wrong, try again later.`, 500);
    res.status(customError.statusCode).json({
      success: false,
      error: customError.message
    });
  }
};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const getAllProductsTesting = async (req, res) => {

  const prod = await Product.find(req.query).sort("-name");

  if (prod) {
    res.json({ product: prod });
  } else {
    res.json({ message: 'Product not found' });
  }
};





module.exports = { getAllProducts, getAllProductsTesting };
