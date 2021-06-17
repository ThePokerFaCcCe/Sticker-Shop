function checkFile(file) {
    const types = ['jpg', 'png'];
    const fileType = file.originalname.split('.').pop().toLowerCase();
    if (types.indexOf(fileType) !== -1) {
        return true
    }
}

module.exports = checkFile;