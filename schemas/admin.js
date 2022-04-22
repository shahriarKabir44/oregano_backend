var mongoose = require('mongoose')

var adminSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    endpoint: { type: String },
    region: { type: String },
})

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin