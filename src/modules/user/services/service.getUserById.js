const mongoose = require('mongoose');
const User = require("../user.model");

const getUserById = async (id) => {
    try { 
        let filterQuery = { _id: new mongoose.Types.ObjectId(id), active: true }
        return await User.findOne(filterQuery)
    } catch (error) {
        console.log("error",error);
        return null
    }
}
module.exports = getUserById