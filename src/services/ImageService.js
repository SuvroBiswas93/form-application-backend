const fs = require("fs");
const { imageUploader, isMulterError, handleMulterError } = require("./ImageUploaderService");
const ImageModel = require("../model/Image");
module.exports = {
    uploadSingleImage: async( req, res)=> {
        imageUploader.single("image")(req, res, async function (err) {
             if(err) {
                if(isMulterError(err)) {
                    return handleMulterError(res,err);
                }
                return res.status(400).json({ error: err.message});
             }
        
            // Everything went fine, proceed with the upload logic
            const image = req.file;
            console.log(image);
            
            const data = {
                image: image.filename
            };
            var newImage = new ImageModel(data);
            
            try {
                const docs = await newImage.save()
                return res.json({image: docs.image,
                    host: req.protocol + '://' + req.get('host')});
            } catch(e) {
                fs.unlinkSync(image.path);
                return res.status(500).json({error:"Failed to save image upload"});
            }    
          });
    },

    getImages: async(_, res)=>{
        try{
            var result = await ImageModel.find().lean();
            res.json(result);     
        }catch(e){
            res.send(e);
        }
    }
}