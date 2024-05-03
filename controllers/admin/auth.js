const { sign } = require("jsonwebtoken");
const { compare } = require("bcryptjs");

const User = require("../../models/User");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const userRole = user.role;

    if (userRole !== "admin" && userRole !== "consultant") {
      const error = new Error(
        "A user with this email is not an admin or a consultant."
      );
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw error;
    }

    const token = sign({ userId: user._id, userRole }, "someadminsecret");
    res.status(201).json({ token });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("Not found user.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ id: user._id, role: user.role });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
