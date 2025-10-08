import FileUploader from "../component/FileUploader";

export default function UploadPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-semibold text-center text-blue-700 mb-4">
          Upload Legal Document
        </h1>
        <p className="text-center text-blue-500 mb-8">
          Upload a DOCX or PDF file to automatically convert it into a smart legal template.
        </p>

        <FileUploader />
      </div>
    </main>
  );
}
