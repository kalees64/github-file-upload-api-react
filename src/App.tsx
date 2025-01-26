import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const GITHUB_API_BASE_URL = "https://api.github.com";
  const OWNER = "kalees64";
  const REPO = "file-upload";
  const BRANCH = "main";
  const ACCESS_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const content = reader.result?.toString().split(",")[1]; // Base64 content
        const path = `uploads/${file.name}`; // Path in the repo

        const response = await axios.put(
          `${GITHUB_API_BASE_URL}/repos/${OWNER}/${REPO}/contents/${path}`,
          {
            message: `Upload ${file.name}`,
            content,
            branch: BRANCH,
          },
          {
            headers: {
              Authorization: `token ${ACCESS_TOKEN}`,
            },
          }
        );

        const fileUrl = response.data.content.html_url;
        setFileUrl(fileUrl);
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Check console for details.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="w-screen h-screen bg-red-300 grid place-items-center">
      <div className="w-96 rounded bg-white">
        <form
          className="p-5 grid gap-2"
          onSubmit={(e: React.FormEvent) => {
            handleUpload(e);
          }}
        >
          <label htmlFor="file" className="font-semibold">
            Upload File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="rounded bg-blue-500 p-3 text-white cursor-pointer"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            className="rounded bg-green-500 p-2 text-white font-semibold cursor-pointer"
            onClick={handleUpload}
          >
            Upload
          </button>
        </form>

        {fileUrl && (
          <div className="grid gap-2 p-4">
            <p className="pt-4">
              File URL:{" "}
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                {fileUrl}
              </a>
            </p>
            <img
              src={`${fileUrl}?raw=true`}
              alt="Uploaded file"
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
