const User = require("../models/userModel");
const factory = require("./handlerFactory");

exports.getAllUsers = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
exports.updateOneUser = factory.updateOne(User);
exports.deleteOneUser = factory.deleteOne(User);
exports.createOneUser = factory.createOne(User);
