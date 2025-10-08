import { connect } from "@/dbConnect/connect";
import Upload from "@/models/model";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { params } = await context;
  const { id } = params;

  console.log("Fetching document with ID:", id);

  try {
    await connect();

    const document = await Upload.findById(id);
    console.log(document, "Fetched document from database");
    
    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, document});
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch document" },
      { status: 500 }
    );
  }
}
