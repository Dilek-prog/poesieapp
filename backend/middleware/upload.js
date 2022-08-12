const multer = require("multer");
const {
    GridFsStorage
} = require("multer-gridfs-storage");

const storage = new GridFsStorage({
    url: process.env.DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            console.log('file.mimetype === -1')
            return `${Date.now()}-do-${file.originalname}`;
        }
        console.log('store');
        return {
            bucketName: 'posts',
            filename: `${Date.now()}-do-${file.originalname}`,
        };
    },
});

module.exports = multer({ storage });