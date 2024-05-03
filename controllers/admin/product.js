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

    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Not found product.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(product);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    if (!req.files) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      throw error;
    }

    const imgList = req.files["images"]?.map(
      (file) =>
        req.protocol +
        "://" +
        req.get("host") +
        "/" +
        file.path.replace("\\", "/")
    );

    const name = req.body.name.trim();
    const category = req.body.category.trim().toLowerCase();
    const price = +req.body.price;
    const count = +req.body.count;
    const short_desc = req.body.shortDesc.trim();
    const long_desc = req.body.longDesc.trim();

    const img1 = imgList[0];
    const img2 = imgList[1];
    const img3 = imgList[2];
    const img4 = imgList[3];

    const product = new Product({
      name,
      category,
      price,
      count,
      short_desc,
      long_desc,
      img1,
      img2,
      img3,
      img4,
    });

    await product.save();
    res.status(201).json({ message: "Added product." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      const error = new Error("No params found.");
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Not found product.");
      error.statusCode = 404;
      throw error;
    }

    product.name = req.body.name.trim();
    product.category = req.body.category.trim().toLowerCase();
    product.price = +req.body.price;
    product.count = +req.body.count;
    product.short_desc = req.body.shortDesc.trim();
    product.long_desc = req.body.longDesc.trim();

    await product.save();
    res.status(201).json({ message: "Edited product." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      const error = new Error("No params found.");
      error.statusCode = 400;
      throw error;
    }

    await Product.findByIdAndDelete(productId);

    res.status(201).json({ message: "Deleted product." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
