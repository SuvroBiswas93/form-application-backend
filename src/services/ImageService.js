const imageUploadService = require("./ImageUploaderService");
const ImageModel = require("../model/Image");

module.exports = {
    saveImageInfo: async (path) => {
        const data = {
            image: path
        };
        const imageModel = new ImageModel(data);
        return await imageModel.save();
    },

    uploadSingleImage: async(imageFieldName, req, res) => {
       return await imageUploadService.uploadSingleImage(imageFieldName, req,res)
    },

    getImages: async()=>{
        return await ImageModel.find().lean();
    }
}