var mongoose = require('mongoose')

var facebookSchema = new mongoose.Schema({


    facebookId: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId },

})

const Facebook = mongoose.model('Facebook', facebookSchema)
module.exports = Facebook