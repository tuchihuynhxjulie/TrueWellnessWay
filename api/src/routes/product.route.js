const express = require(`express`);

const { addProduct,
        addProducts,
        getProducts,
        getProductDetail,
        getProductPicture,
        updateProduct,
        updateProductImage,
        searchByKeyword,
        searchByCategory,
} = require("../controllers/product.controller");

const {
        product_picture_upload,
} = require("../utils/multerConfig");

const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

const router = express.Router();

router.post("/addProduct", verifyAdmin, addProduct);

router.post("/addProducts", verifyAdmin, addProducts);

router.get("/getProducts", getProducts);

router.get("/getProductDetail", getProductDetail);

router.get("/getProductPicture", getProductPicture);

router.post("/updateProduct", verifyAdmin, updateProduct);

router.put("/updateProductImage", 
            verifyAdmin, 
            product_picture_upload.single("file"), 
            updateProductImage);

router.get("/searchByKeyword", searchByKeyword);

router.get("/searchByCategory", searchByCategory);

module.exports = router;

