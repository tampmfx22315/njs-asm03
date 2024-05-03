const { validationResult } = require("express-validator");
const { createTransport } = require("nodemailer");

const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");
const convertNumber = require("../../utils/convertNumber");

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "tampmfx22315@gmail.com",
    pass: "myev qirj xwmt pcon",
  },
});

exports.addOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { fullName, email, phoneNumber, address, total, items } = req.body;
    const { userId } = req;

    if (items.length === 0) {
      const error = new Error("Empty cart.");
      error.statusCode = 422;
      throw error;
    }

    // Kiểm tra sản phẩm
    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product || product.count < item.quantity) {
        const error = new Error("Order failed.");
        error.statusCode = 422;
        throw error;
      }
    }

    // Tạo order mới
    const newOrder = new Order({
      user: userId,
      fullName,
      email,
      phoneNumber,
      address,
      items,
      total,
    });
    const result = await newOrder.save();

    // Thêm order mới vào dữ liệu user
    const user = await User.findById(userId);
    user.orders.push(result._id);
    await user.save();

    // Cập nhật lại lượng hàng trong kho
    for (let item of items) {
      const product = await Product.findById(item.product);
      product.count -= item.quantity;
      await product.save();
    }

    // Gửi email
    const createdOrder = await Order.findById(result._id).populate(
      "items.product"
    );

    const renderOrderItems = createdOrder.items
      .map((item) => {
        return `<tr style="font-size: large; text-align: center">
        <td style="border: 1px solid #000">${item.product.name}</td>
        <td style="border: 1px solid #000">
            <img src="${item.product.img1}" height="100" alt="${
          item.product.name
        }" />
        </td>
        <td style="border: 1px solid #000">${convertNumber(
          item.product.price
        )} VND</td>
        <td style="border: 1px solid #000">${item.quantity}</td>
        <td style="border: 1px solid #000">${convertNumber(
          item.product.price * item.quantity
        )} VND</td>
      </tr>`;
      })
      .join("");

    transporter.sendMail({
      to: email,
      from: "tampmfx22315@gmail.com",
      subject: "Xác nhận đơn hàng " + createdOrder._id,
      html: `
        <h1>Xin chào ${fullName}</h1>
        <p>Phone: ${phoneNumber}</p>
        <p>Address: ${address}</p>
        <table>
          <thead>
            <tr>
              <th style="border: 1px solid #000">Tên sản phẩm</th>
              <th style="border: 1px solid #000">Hình ảnh</th>
              <th style="border: 1px solid #000">Giá</th>
              <th style="border: 1px solid #000">Số lượng</th>
              <th style="border: 1px solid #000">Thành tiền</th>
            </tr>
          </thead>
          <tbody>${renderOrderItems}</tbody>
        </table>
        <h1>Tổng thanh toán: ${convertNumber(total)} VND</h1>
        <h1>Cảm ơn bạn!</h1>
      `,
    });

    res.status(201).json({ message: "Created order." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId });
    res.status(200).json(orders);
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

    if (order.user.toString() !== req.userId.toString()) {
      const error = new Error("Not allowed.");
      error.statusCode = 403;
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
