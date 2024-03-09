require('dotenv').config()
const mongoose = require('mongoose');
const connectToDatabase =async ()=>{
    try {
        const {connection} = await mongoose.connect(
            process.env.MONGO_URL
            ,{
            dbName :"task_manager"
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDatabase;
