const Product = require('../models/Product');
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");


// ~~~~~~~~~~~~~GET ALL PRODUCTS FROM products COLLECTION~~~~~~~~~~~~~~~

exports.getAllProducts = asyncHandler(async (req, res, next) => {

     let query;
     let uiValues = {
     filtering: {},
     sorting: {},
  };

  // ~~~~~~~~~~~~~Parsing and Filtering Request Query Parameters~~~~~~~~~~~~~~~

  const reqQuery = { ...req.query };
  const removeFields = ["sort", "page", "limit"];
  removeFields.forEach((val) => delete reqQuery[val]);

  const filterKeys = Object.keys(reqQuery);
  const filterValues = Object.values(reqQuery);

  filterKeys.forEach(
    (val, idx) => (uiValues.filtering[val] = filterValues[idx])
  );

  // ~~~~~~~~~~~~~Building MongoDB Query:~~~~~~~~~~~~~~~

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Product.find(JSON.parse(queryStr));

  // ~~~~~~~~~~~~~Sorting Results:~~~~~~~~~~~~~~~

  if (req.query.sort) {
    const sortByArr = req.query.sort.split(",");
    sortByArr.forEach((val) => {
      let order;
      if (val[0] === "-") {
        order = "descending";
      } else {
        order = "ascending";
      }
      uiValues.sorting[val.replace("-", "")] = order;
    });
    const sortByStr = sortByArr.join(" ");
    query = query.sort(sortByStr);
  } else {
    query = query.sort("-price");
  }

  // ~~~~~~~~~~~~~Selecting Specific Fields:~~~~~~~~~~~~~~~

  const select = req.query.select;
  if (select) {
    let selectFix = select.split(",").join(" ");
    query = query.select(selectFix);
  }

 // ~~~~~~~~~~~~~Pagination:~~~~~~~~~~~~~~~ 

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) ||8;
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

 // ~~~~~~~~~~~~~Query Execution and Response:~~~~~~~~~~~~~~~

  const Products = await query;
  const totalCount = await Product.countDocuments();
  const totalPages = Math.ceil(totalCount / limit);
  const maxPrice = await Product.find()
    .sort({ price: -1 })
    .limit(1)
    .select("-_id price");
  const minPrice = await Product.find()
    .sort({ price: 1 })
    .limit(1)
    .select("-_id price");
  uiValues.maxPrice = maxPrice[0].price;
  uiValues.minPrice = minPrice[0].price;
  res.status(200).json({
    success: true,
    data: Products,
    uiValues,
    pagination: {
      totalPages,
      currentPage: page,
      totalHits: totalCount,
    },
  });

});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CREATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

exports.createNewProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: products,
  });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


exports.updateProductsById = asyncHandler(async (req, res, next) => {
  let products = await Product.findById(req.params.id);

  if (!products) {
    return next(
      new ErrorResponse(`Products with id ${req.params.id} was not found`, 404)
    );
  }

  products = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: products,
  });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DELETE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


exports.deleteProductsById = asyncHandler(async (req, res, next) => {
  let products = await Product.findById(req.params.id);

  if (!products) {
    return next(
      new ErrorResponse(`Products with id ${req.params.id} was not found`, 404)
    );
  }

  await products.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});





