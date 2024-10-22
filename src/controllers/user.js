const userService = require("../services/UserService");
const formService = require("../services/FormService");
const {ApiError} = require("../utils/ApiError");

module.exports = {

    getUsers : async(_,res)=>{
            const result = await userService.getAllUsers();
            if(Array.isArray(result)) {
              return res.status(200).json(result.map(({password, createdForms,__v, ...rest})=>({...rest})))
            }
            res.status(200).json([]);
    },

    register: async (req, res) => {
        
        const { email, password, name } = req.body;

          const existingUser = await userService.getUserByEmail(email);
          
          if(existingUser) {
            throw new ApiError(409, "User allready exists");
          }


          const newUser = await userService.createUser({name, password, email});

          const accessToken = userService.generateAccessToken({email, name, id: newUser._id});

          return res.json({ accessToken, user: {email, name} });
    },

    login: async(req,res)=>{   
        const { email, password } = req.body;
        console.log(email)
          const user = await userService.getUserByEmail(email);
          if(!user){
            throw new ApiError(404, "User doesn't exists");
          }
          const isValidPassword = await userService.comparePassword(password, user.password);
          if(!isValidPassword){
            throw new ApiError(403, "Invalid credentials");
          }
          const accessToken = userService.generateAccessToken({email, name: user.name, id: user._id});
          return res.json({ accessToken, user: {email, name:user.name, id: user._id} });
    },
    getAllFormsOfUser: async(req, res)=>{
      const userId = req.params.userId;
      const user = await userService.getUserById(userId);
      if(!user) {
          throw new ApiError(403);
      }
      if(!Array.isArray(user.createdForms)) {
          return res.status(200).json([]);
      }
      const forms = await formService.getFormsByIds(user.createdForms);
      return res.status(200).json(forms);   
  },

}