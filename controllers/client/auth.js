const { validationResult } = require("express-validator");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const User = require("../../models/User");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { fullName, email, password, phoneNumber } = req.body;
    const hashedPassword = await hash(password, 12);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await user.save();
    res.status(201).json({ message: "Created user." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw error;
    }

    const token = sign({ userId: user._id }, "someclientsecret");
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

    const { fullName, email, phoneNumber } = user;
    res.status(200).json({ fullName, email, phoneNumber });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
