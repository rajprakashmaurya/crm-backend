const User = require("../models/user.model");
const constants = require("../utils/constants");

const validateSignUpRequest = async (req, res, next) => {
  //implimate the logic for valide request
  //1. validate user name

  if (!req.body.name) {
    res.status(400).send({
      message: "Falied! Name is not provided",
    });
    return;
  }

  //2.validate userId

  if (!req.body.userId) {
    res.status(400).send({
      message: "Failed! userId is not provided",
    });
    return;
  }

  // 3.validate userId is alredy is already exist

  const user = await User.findOne({ userId: req.body.userId });
  if (user != null) {
    res.status(400).send({
      message: "Failed! userId already exists",
    });
    return;
  }

  //4.validate email

  //5.validate emailId already exists

  const email = await User.findOne({ email: req.body.email });
  if (email != null) {
    res.status(400).send({
      message: "Failed! email already exists",
    });
    return;
  }

  // 6.validate the userType
  const userType = req.body.userType;
  const validUserTypes = [
    constants.userTypes.customer,
    constants.userTypes.admin,
    constants.userTypes.engineer,
  ];
  if (userType && !validUserTypes.includes(userType)) {
    res.status(400).send({
      message: "UserType provided is invalid",
    });
    return;
  }
};

const verifySignUp = {
  validateSignUpRequest: validateSignUpRequest,
};

module.exports = verifySignUp;
