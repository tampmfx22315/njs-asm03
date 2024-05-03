const { validationResult } = require("express-validator");

const Session = require("../../models/Session");
const { getIO } = require("../../socket");

exports.updateSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Empty message.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { roomId } = req.params;

    if (!roomId) {
      const error = new Error("Not found room ID.");
      error.statusCode = 404;
      throw error;
    }

    const session = await Session.findById(roomId);

    if (!session) {
      const error = new Error("Not found session.");
      error.statusCode = 404;
      throw error;
    }

    const addedDate = new Date();
    session.messages.push({
      sender: "admin",
      content: req.body.message,
      time: addedDate,
    });
    await session.save();
    getIO().emit("admin chat", { action: "send", roomId });
    res.status(201).json({ roomId });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      const error = new Error("Not found room ID.");
      error.statusCode = 404;
      throw error;
    }

    await Session.findByIdAndDelete(roomId);
    getIO().emit("admin chat", { action: "end", roomId });
    res.status(201).json({ message: "Deleted session." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      const error = new Error("Not found room ID.");
      error.statusCode = 404;
      throw error;
    }

    const session = await Session.findById(roomId);

    if (!session) {
      const error = new Error("Not found session.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(session);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const sessions = await Session.find();
    const contacts = sessions.map((session) => session._id);

    res.status(200).json(contacts);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
