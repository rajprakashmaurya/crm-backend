const constants = require("../utils/constants");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");

exports.signup = async (req, res) => {
  var userStatus = req.body.userStatus;
  var userType = req.body.userType;
  if (userType == constants.userTypes.customer) {
    userStatus = constants.userStatus.approved;
  } else {
    userStatus = constants.userStatus.pending;
  }

  try {
    const createUser = await User.create({
      name: req.body.name,
      userId: req.body.userId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      userType: req.body.userType,
      userStatus: userStatus,
    });

    const postReponse = {
      name: createUser.name,
      userId: createUser.userId,
      email: createUser.email,
      userType: createUser.userType,
      userStatus: createUser.userStatus,
      createdAt: createUser.createdAt,
      updatedAt: createUser.updatedAt,
    };
    response.status(200).send(postReponse);
  } catch (e) {
    console.log("Error occured while creating the user");
    response.status(500).send({
      message: "some internal error occured while creating the user",
    });
  }
};
