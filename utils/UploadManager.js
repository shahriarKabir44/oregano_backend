const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({})

const upload = multer({ storage })

function uploader(req, res) {
    const { uploadpath, imagename } = req.headers
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('uploads/' + uploadpath)) {
            fs.mkdirSync('uploads/' + uploadpath, { recursive: true });
        }
        let base64Image = req.body.file.split(';base64,').pop();
        fs.writeFile('uploads/' + uploadpath + imagename + '.jpg', base64Image, { encoding: 'base64' }, function (err) {
            resolve()
        });
    })
}
module.exports = { upload, uploader };