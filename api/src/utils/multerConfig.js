const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destination = "Resources/";
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      destination = "Resources/images/";
    }
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};
const product_picture_upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = { product_picture_upload };
