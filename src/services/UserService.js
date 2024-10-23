const UserModel = require('../model/User')
const jwt = require('jsonwebtoken');
const bcryptjs = require("bcryptjs");
const { SECRET_KEY } = require('../config/environment');
const {ApiError} = require("../utils/ApiError")

module.exports = {
  getAllUsers: async()=> {
    return await UserModel.find().select('-password');
  },
  getUserById: async (userId) => {
    // Find the user by ID
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
  },
  getUserByEmail: async(email)=> {
    console.log(email)
    return await UserModel.findOne({ email }).lean();
  },
  createUser: async(data)=> {
    const hashedPassword = bcryptjs.hashSync(data.password, 10);
    const user = new UserModel({
      name: data.name,
      email: data.email,
      password: hashedPassword
      });
    return await user.save();
  },
  updateUser: async(id, data)=> {
    return await UserModel.findByIdAndUpdate(id, data, {new: true}).lean();
  },
  deleteUser: async(id)=> {
    return await UserModel.findByIdAndDelete(id);
  },

  generateAccessToken: (tokenPayload)=> {
    return jwt.sign(tokenPayload, SECRET_KEY, {expiresIn: '24h'});
  },

  comparePassword: async (password, hashedPassword)=> {
    return await bcryptjs.compare(password, hashedPassword);
  }

}