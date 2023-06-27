const constants = require("../utils/constants");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");

//for signUp
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

//for signIn method
exports.signin = async (req, res) => {
  const user = await User.findOne({
    userId: req.body.userId,
  });
  if (!user) {
    res.status(400).send({
      message: "Failed! userId already exists",
    });
    return;
  }
  if (user.userStatus != constants.userStatus.approved) {
    res.status(403).send({
      message:
        "Cannot  allow user to login as the status is " + user.userStatus,
    });
    return;
  }
  //check the password matches
  var isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    res.status(401).send({
      message: "Invalid password",
    });
  }
  var token = jwt.sign({ id: user.userId }, authConfig.secretKey, {
    expireIn: 86400,
  });
  res.status(200).send({
    name: user.name,
    userId: user.userId,
    email: user.email,
    userType: user.userType,
    userStatus: user.userStatus,
    accessToken: token,
  });
};
