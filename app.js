const { createServer } = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connect } = require("mongoose");
const multer = require("multer");
const path = require("path");
const uuid = require("uuid");

const clientRoutes = require("./routes/client");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },

  filename: (req, file, cb) => {
    cb(null, uuid.v4() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage, fileFilter }).fields([{ name: "images", maxCount: 4 }])
);

app.use("/client", clientRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});

connect(
  "mongodb+srv://tampmfx22315:gLcx0rYExp1WgaJ8@cluster0.rfm2asq.mongodb.net/boutique?retryWrites=true"
)
  .then((result) => {
    const server = createServer(app);
    const io = require("./socket").init(server);

    io.on("connection", (socket) => {
      console.log("Connected.");
    });

    server.listen(port);
  })
  .catch((err) => console.log(err));
