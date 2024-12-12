const express = require(`express`);
const {updateUser, 
        getUser,
        getAllUsers,
} = require("../controllers/user.controller");
const { verifyToken, verifyAdmin } = require("../utils/verifyToken");
const router = express.Router();


router.get("/getuser", verifyToken, getUser);

router.get("/getallusers", verifyAdmin, getAllUsers);

router.patch("/updateUser", verifyToken, updateUser);

module.exports = router;

// get all users Info verify admin