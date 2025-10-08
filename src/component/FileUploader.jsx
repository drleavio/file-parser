"use client";
import React, { useRef, useState } from "react";
import { UploadCloud, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const [loading,setLoading]=useState(false);

  const handleFiles = (selected) => {
    const newFiles = Array.from(selected);
    setFiles([...files, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

async function getPublicIp() {
  const res = await fetch("https://api.ipify.org?format=json");
  const { ip } = await res.json();
  return ip; 
}

 const handleUpload = async () => {
  setUploading(true);
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file)); 
    const ip=await getPublicIp()
    formData.append("ip",ip);
  try {
    const res = await axios.post("/api/upload",formData, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    const data = res.data; 
    setUploading(false);

    if (data.text) {
      console.log("✅ Parsed Text Preview:", data.text);
      console.log("Entry ID:", data.id);
      
      alert("File parsed successfully!");
    } else if (data.error) {
       alert("Upload failed: " + data.error);
    } else {
        alert("Upload failed: Unknown error.");
    }
  } catch (error) {
    setUploading(false);
    const errorMessage = error.response?.data?.error || error.message || "A network error occurred";
    alert("Upload failed: " + errorMessage);
    console.error("Upload error:", error);
  }
};


  return (
    <Card className="shadow-lg border-blue-200">
      <CardHeader className="text-center text-blue-700 font-semibold">
        Upload Your Document
      </CardHeader>

      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-blue-300 bg-white hover:bg-blue-50"
          }`}
        >
          <UploadCloud className="w-16 h-16 text-blue-500 mb-3" />
          <p className="text-blue-700 font-medium">
            {isDragging ? "Drop your files here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-sm text-blue-400 mt-1">Supports .pdf, .docx</p>

          <input
            type="file"
            accept=".pdf,.docx"
            multiple
            ref={inputRef}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="mt-5 space-y-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500 w-5 h-5" />
                  <span className="text-blue-800 text-sm truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(i)}
                  className="text-blue-400 hover:text-blue-700 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <Progress value={70} className="h-2 bg-blue-100" />
            <p className="text-blue-500 text-sm text-center mt-1">Uploading...</p>
          </div>
        )}
       <div className="flex justify-end mt-4">
            <Button onClick={()=>handleUpload()} className={"bg-blue-500 hover:bg-blue-600 cursor-pointer"}>{loading?"Uploading...":"Upload"}</Button>
        </div>
      </CardContent>
       
    </Card>
  );
}
