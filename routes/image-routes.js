const express =require("express")
const authMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware")
const {uploadImage, fetchImageController, deleteImageController } = require("../controllers/image-controllers")
const router =express.Router();

//upload the image
router.post("/upload", authMiddleware, isAdminUser, uploadMiddleware.single("image"), uploadImage);

//to get all image
router.get("/get", authMiddleware, fetchImageController);

//to delete an image
router.delete("/:id", authMiddleware, isAdminUser, deleteImageController);

module.exports = router;