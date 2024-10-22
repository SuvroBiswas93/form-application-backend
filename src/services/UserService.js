const UserModel = require('../model/User')
const jwt = require('jsonwebtoken');
const bcryptjs = require("bcryptjs");
const { SECRET_KEY } = require('../config/environment');

module.exports = {
  getAllUsers: async()=> {
    return await UserModel.find().lean();
  },
  getUserById: async(id)=> {
    return await UserModel.findById(id).lean();
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