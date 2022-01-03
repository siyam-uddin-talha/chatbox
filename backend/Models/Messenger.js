
const mongoose = require('mongoose');

const MessengerSchema = new mongoose.Schema({
    room: [
        {
            sender: {
                type: String,
                required: true
            },
            text: {
                type: String,
            },
            // emoji: {
            //     type: String,
            // },
        }
    ],

})
const Messenger = mongoose.model('messenger', MessengerSchema)

module.exports = Messenger
