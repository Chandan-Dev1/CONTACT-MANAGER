import mongoose from 'mongoose'

async function DatabaseConnect() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("database conecct")
}

export default DatabaseConnect