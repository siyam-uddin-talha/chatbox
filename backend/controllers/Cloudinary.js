const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "light-house",
    api_key: "188565842427491",
    api_secret: "TcaaLFJsy9CwG44AG38VQ10ZGOs"
})

module.exports = cloudinary