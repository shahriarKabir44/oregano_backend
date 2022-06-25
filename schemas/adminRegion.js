var mongoose = require('mongoose')

var adminRegion = new mongoose.Schema({
    adminId: { type: mongoose.Types.ObjectId, ref: "Admin" },
    region: { type: String } 
})

const AdminRegion = mongoose.model('AdminRegion', adminRegion)
module.exports = AdminRegion