const imageService = require("../services/ImageService");

module.exports = {

    getImages: async (req, res)=> {
        const images = await imageService.getImages();
        return res.json(images);
    },

    uploadSingleImage:async (req,res)=> {
        const path =  await imageService.uploadSingleImage("image", req,res);
        const savedImage = await imageService.saveImageInfo(path);
        return res.json(savedImage);
    }
}