export const runtime = "nodejs";
import { connect } from "@/dbConnect/connect";
import Upload from "@/models/model";
import mammoth from "mammoth";
const pdf = require("pdf-parse");


/**
 * Handles file upload and parses text content from .pdf or .docx files.
 * @param {Request} req The incoming request object.
 * @returns {Response} A JSON response containing the extracted text or an error.
 */
export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the File/Blob object from formData() into a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    const fileName = file.name || ""; 

    if (fileName.endsWith(".pdf")) {
      // Use the function reference 'pdf'
      const result = await pdf(buffer); 
      text = result.text;
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return Response.json({ error: "Unsupported file format" }, { status: 400 });
    }

    return Response.json({ text });
  } catch (err) {
    console.error("Upload error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err) || "File parsing failed";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}