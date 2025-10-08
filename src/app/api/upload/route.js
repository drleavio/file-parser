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
        await connect();
        const data = await req.formData();
        const ip = data.get("ip");
        console.log("Upload request from IP:", ip);
        const file = data.get("file") || data.get("files");

        if (!file) {
            return Response.json({ error: "No file uploaded. Please ensure the client uses 'file' or 'files' as the key." }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";

        const fileName = file.name || "";

        if (fileName.endsWith(".pdf")) {
            const result = await pdf(buffer);
            text = result.text;
        } else if (fileName.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            return Response.json({ error: "Unsupported file format. Only .pdf and .docx are allowed." }, { status: 400 });
        }
        const newEntry = await Upload.create({
      ip,
      extractedText:text,
    });
    const id=newEntry._id;
    console.log("File parsed successfully. Entry ID:", id);
    
        return Response.json({ text,id }, { status: 200 });
    } catch (err) {
        console.error("Upload error:", err);
        const errorMessage = err instanceof Error ? err.message : String(err) || "File parsing failed";
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}
