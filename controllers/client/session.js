const { validationResult } = require("express-validator");

const Session = require("../../models/Session");
const { getIO } = require("../../socket");

exports.addSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Empty message.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const addedDate = new Date();
    const session = new Session({
      messages: [
        { sender: "client", content: req.body.message, time: addedDate },
      ],
    });
    const result = await session.save();
    const roomId = result._id;
    getIO().emit("client chat", { action: "send", roomId });
    res.status(201).json({ roomId });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

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
      sender: "client",
      content: req.body.message,
      time: addedDate,
    });
    await session.save();
    getIO().emit("client chat", { action: "send", roomId });
    res.status(201).json({ roomId });
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

    res.status(200).json(session.messages);
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
    getIO().emit("client chat", { action: "end", roomId });
    res.status(201).json({ message: "Deleted session." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
