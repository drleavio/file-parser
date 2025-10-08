"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export function generateMarkdownTemplate(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { markdown: "", variables: [] };
  }

  let text = rawText.trim();
  const variables = new Set();
  const addVar = (name, example, description) => {
    variables.add(
      JSON.stringify({
        name,
        example,
        description,
      })
    );
    return `{{${name}}}`;
  };

  text = text.replace(
    /\b\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/gi,
    (match) => addVar("date", match, "A date mentioned in the document")
  );

  text = text.replace(/\b[A-Z]{2,}(?:\s+[A-Z]{2,})*\b/g, (match) =>
    addVar("organization_name", match, "An organization or company name")
  );

  text = text.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, (match) =>
    addVar("person_name", match, "A person's full name")
  );

  text = text.replace(/\b[A-Z][a-z]+\b/g, (match) =>
    addVar("location", match, "A location, city, or place name")
  );

  text = text.replace(/\s{2,}/g, " ").trim();

  const markdown = `
# Legal Document Template

**Generated on:** ${new Date().toLocaleDateString()}

---

${text}
`;

  const variableList = Array.from(variables).map((v) => JSON.parse(v));

  return { markdown, variables: variableList };
}

async function getPublicIp() {
  const res = await fetch("https://api.ipify.org?format=json");
  const { ip } = await res.json();
  return ip;
}
const ip=await getPublicIp();

export default function ViewExtractedData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/extract",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ip":ip 
        },
      });
      const result = await res.json();
      console.log("Fetched data:", result);
      
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  const { markdown, variables } = generateMarkdownTemplate(data.map(d => d.extractedText).join("\n\n"));
  console.log("Generated Markdown:", markdown);
  console.log("Identified Variables:", variables);
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Extracted PDF Data
      </h1>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">No data found.</p>
      ) : (
        data.map((item) => (
          <div
            key={item._id}
            className="border border-gray-200 p-4 mb-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm text-gray-700">
                📍 IP: {item.ip}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(item.uploadedAt).toLocaleString()}
              </span>
              <span>
                <Button onClick={()=>{
                    router.push(`/edit/${item._id}`);
                }}>Edit</Button>
              </span>
            </div>
            <p className="whitespace-pre-wrap text-gray-800 text-sm">
              {markdown}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
