import mongoose from "mongoose"

export const connect=async()=>{
    try {
        const res=await mongoose.connect(process.env.MONGO_URI);
        if(res){
            console.log("Database connected");
        }
    } catch (error) {
        console.log("Database connection error:",error);
    }
}