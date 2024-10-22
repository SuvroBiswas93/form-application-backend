const UserModel = require('../model/User')
const jwt = require('jsonwebtoken');
const bcryptjs = require("bcryptjs");
const { SECRET_KEY } = require('../config/environment');

module.exports = {
    getUsers : async(req,res)=>{
        try{
            const result = await UserModel.find().lean();
            if(Array.isArray(result)) {
              return res.status(200).json(result.map(({password, createdForms,__v, ...rest})=>({...rest})))
            }
            res.status(200).json([]);     
        }catch(e){
            res.send(e);
        }
    },
    register: async (req, res) => {
        
        const { email, password, name } = req.body;
        try {
          const result = await UserModel.findOne({email:req.body.email}).lean()
          if(result){
            return res.status(400).json({error: "User allready exists"})
          }

          const hashedPassword = await bcryptjs.hash(password, 10);
          const user = new UserModel({ email, password: hashedPassword, name });
          const newUser = await user.save();
          const accessToken = jwt.sign({email, name, id: newUser._id}, SECRET_KEY, {expiresIn: '24h'});
          return res.json({ accessToken, user: {email, name} });
        } catch (error) {
          return res.status(500).json({error: "something went wrong"});
        }

    },
    login: async(req,res)=>{   
        const { email, password } = req.body;
        try {
          const user = await UserModel.findOne({email:req.body.email}).lean()
          if(!user){
            return res.status(400).json({error: "User doesn't exists"});
          }
          const isValidPassword = await bcryptjs.compare(password, user.password);
          if(!isValidPassword){
            return res.status(400).json({error: "Invalid password"});
          }
          const accessToken = jwt.sign({email, name: user.name, id: user._id}, SECRET_KEY, {expiresIn: '24h'});
          return res.json({ accessToken, user: {email, name:user.name} });
        } catch (error) {
          return res.status(500).json({error: "something went wrong"});
        }
    }

}