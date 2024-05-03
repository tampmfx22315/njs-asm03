const Product = require("../../models/Product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      const error = new Error("No params found.");
      error.statusCode = 400;
      throw error;
    }

    const selectedProduct = await Product.findById(productId);

    if (!selectedProduct) {
      const error = new Error("No product found.");
      error.statusCode = 404;
      throw error;
    }

    const relatedProducts = await Product.find({
      category: selectedProduct.category,
    }).then((products) =>
      products.filter(
        (product) => product._id.toString() !== selectedProduct._id.toString()
      )
    );

    res.status(200).json({ selectedProduct, relatedProducts });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
