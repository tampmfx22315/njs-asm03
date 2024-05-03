const User = require("../../models/User");
const Order = require("../../models/Order");

exports.getDashboard = async (req, res, next) => {
  try {
    const users = await User.find({ role: "client" });
    const orders = await Order.find();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    const newOrders = orders
      .filter((order) => order.createdAt.getMonth() === currentMonth)
      .sort((a, b) => b.createdAt - a.createdAt);

    const earningsOfMonth = newOrders.reduce(
      (earnings, order) => (earnings += order.total),
      0
    );

    res
      .status(200)
      .json({ userCount: users.length, earningsOfMonth, newOrders });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "items.product"
    );

    if (!order) {
      const error = new Error("Not found order.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(order);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
