const { User } = require("../models");
const { getUserId } = require("../utils/verifyToken");
const jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {
  try {
    const jwt = req.cookies.access_token || req.headers["authorization"];
    var id = getUserId(jwt);
    const finduser = await User.findByPk(id);
    if (!finduser) return res.status(404).json({ msg: "User not found" });
    return res.status(200).json(finduser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    var id = req.user.id;
    const {
      // firstname,
      // surname,
      // phone,
      // email,
      // jobTitle,
      // employer,
      // citymunicipality,
      // country,
      fullname,
      phone,
      email,
      address,
      country
    } = req.body;

    const finduser = await User.findByPk(id);
    if (!finduser) return res.status(404).json({ msg: "User not found" });

    // var fullName = null;
    // if (surname && firstname) {
    //   fullName = firstname + " " + surname;
    // }

    finduser.set({
      fullname: fullname || finduser.fullname,
      // firstname: firstname || finduser.firstname,
      // surname: surname || finduser.surname,
      phone: phone || finduser.phone,
      email: email || finduser.email,
      address: address || finduser.address,
      // jobTitle: jobTitle || finduser.jobTitle,
      // employer: employer || finduser.employer,
      // citymunicipality: citymunicipality || finduser.citymunicipality,
      country: country || finduser.country,
    });
    await finduser.save();

    console.log("User update information:\nID: " + id);
    console.log(req.body);
    return res.status(200).json({ msg: "User's information updated" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      next(error);
    });
}


module.exports = { updateUser, getUser, getAllUsers };
//fsmegasale15
//sieutuyet20
