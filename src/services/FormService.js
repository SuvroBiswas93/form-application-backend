const FormModel = require('../model/Form')
const UserModel = require('../model/User')
const ResponseModel = require('../model/Response')

module.exports = {
    formsGet : async(req,res)=>{
        try{
            var result = await FormModel.find().lean();
           return res.status(200).json(result);     
        }catch(e){
           return res.status(500).send(e);
        }
    },

    createForm: async(req,res)=>{     
        try {
             const data = {
                createdBy : req.body.createdBy,
                name: req.body.name,
                description: req.body.description
             }

            const form = new FormModel(data);
            const newForm = await form.save();
         
           await UserModel.updateOne({
                _id: data.createdBy
            },
            { $push: { createdForms: newForm._id}});

            return res.status(200).json(newForm);

        } catch (error) {
            res.status(500).send(error)
        }
    },

    getFormById: async(req, res)=>{
        try {
            var formId = req.params.formId;

            const form = await FormModel.findOne({_id: formId});
            if(!form) {
                return res.status(404).json({error:"Form not found"});
            }
            return res.status(200).json(form);

        } catch (error) {
           return res.status(500).send(error);
        }
    },
    
    deleteForm: async(req, res)=>{
        console.log({de: "delete"})
        try {
            const formId = req.params.formId;
            const userId = req.params.userId;
          
            const form = await FormModel.findOne({_id: formId}).lean();

            if(form != null && form.createdBy == userId) {
                await FormModel.deleteOne({_id: formId});
                return res.status(200).end();
            }
            
            return res.status(400).end();

        } catch (error) {
            return res.status(500).send(error);
        }
    },

    editForm : async(req, res)=>{
        try {
            var  formId =  req.body.formId;
            var data = {
                name: req.body.name,
                description: req.body.description,
                questions: req.body.questions
            }

            console.log("Hi, I am from backend, this is form data that i recivied");
            

            console.log(data);
            

            FormModel.findByIdAndUpdate(formId, data ,{new: true} ,(err, result)=>{
                if(err){
                    res.status(500).send(err)
                }
                else{
                    res.status(200).json(result)
                }
            });
           
        } catch (error) {
            res.send(error)
        }
    },

    getAllFormsOfUser: async(req, res)=>{
        try {
            var userId = req.params.userId;
            console.log(userId);
            await UserModel.findOne({_id:userId}).then(async(user)=>{
                if(user == null){
                    res.status(404).send('User not found');
                } else{ 
                   await FormModel.find().where('_id').in(user.createdForms).exec((err, records) => {
                       console.log(records);
       
                       res.status(200).json(records);
                   });
                }

             //   res.send(docs.createdForms)
            });

            
        } catch (error) {
            res.send(error)
        }
    },

    submitResponse : async(req, res)=>{
        try {
            var data = {
                formId: req.body.formId,
                userId: req.body.userId,
                response: req.body.response
            }
            console.log(data.formId);
            console.log(data.userId);
            
            
            if (data.response.length > 0) {
                var newResponse = new ResponseModel(data)
               // console.log(newResponse);
                
                await newResponse.save().then((docs)=>{              
                    res.status(200).json(
                        docs
                    );
                })
            } 
            else{
                res.status(400).send("FIll atleast one field, MF!"); 
            } 
        } catch (error) {
            res.send(error)
        }
    },

    allResponses : async(req,res)=>{
        try{
            var result = await ResponseModel.find().lean();
            res.json(result);     
        }catch(e){
            res.send(e);
        }
    },

    getResponse: async(req, res)=>{
        try {
            var formId = req.params.formId;
         //   console.log(formId);
            
            await ResponseModel.find({formId: formId}).then(async(responses)=>{ 
                    res.status(200).json(responses)
            })

        } catch (error) {
            res.send(error)
        }
    }

}


