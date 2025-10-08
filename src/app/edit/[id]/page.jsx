"use client";
import React, { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";

const mdParser = new MarkdownIt();

const MarkdownEditor = () => {
  const params = useParams(); 
  const { id } = params;

  const [markdown, setMarkdown] = useState(""); 

  useEffect(() => {
    if (!id) return; 

    console.log("Editing document with ID:", id);

    fetch(`/api/document/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched document data:", data);
        
        if (data) {
          setMarkdown(data.document.extractedText || "");
        } else {
          console.error("No markdown content found for ID:", id);
        }
      })
      .catch((err) => {
        console.error("Error fetching markdown content:", err);
      });
  }, [id]);
const downloadPDF = () => {
  const doc = new jsPDF();
  const lines = markdown.split("\n"); // split markdown into lines
  let y = 10;
  lines.forEach((line) => {
    doc.text(line, 10, y);
    y += 10; // line spacing
  });
  doc.save(`document_${id}.pdf`);
};

// Download as DOCX
const downloadDOCX = async () => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: markdown.split("\n").map((line) => new Paragraph(line)),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `document_${id}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document_${id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen bg-blue-50 p-6 flex flex-col">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Edit Markdown Template
      </h2>

      <div className="flex-1 mb-4">
        <MdEditor
          value={markdown}
          style={{ height: "80vh" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ text }) => setMarkdown(text)}
        />
      </div>

     <div className="flex gap-4">
       <button
        onClick={downloadPDF}
        className="self-start px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        Download PDF
      </button>
       <button
        onClick={downloadDOCX}
        className="self-start px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        Download DOCX
      </button>
     </div>
    </div>
  );
};

export default MarkdownEditor;
