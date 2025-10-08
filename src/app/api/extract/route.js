import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConnect/connect";
import Upload from "@/models/model";

const MONGO_URI = process.env.MONGO_URI;

export async function GET(req) {
    await connect();
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGO_URI);
    }
    const ip = req.headers.get("ip");
    console.log("Data fetch request from IP:", ip);
    const data = await Upload.find({ip}).sort({ createdAt: -1 });
    console.log(`Fetched ${data.length} entries from the database for IP: ${ip}`,data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
