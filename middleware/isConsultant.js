const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = verify(token, "someadminsecret");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (
    !decodedToken ||
    (decodedToken.userRole !== "admin" &&
      decodedToken.userRole !== "consultant")
  ) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  req.userRole = decodedToken.userRole;

  next();
};
