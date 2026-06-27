import { useState, useRef } from "react";
import axios from "axios";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (data) {
      // Using standard File object instead of Buffer since Pinata accepts File
      setFile(data);
      setFileName(data.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });
        
        const ipfsHash = resFile.data.IpfsHash;
        const imgUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
        await contract.add(account, imgUrl);
        alert("Successfully uploaded image to blockchain!");
        
        setFileName("No image selected");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (e) {
        console.error(e);
        alert("Unable to upload image to Pinata");
      }
      setUploading(false);
    }
  };

  return (
    <div className="section-card upload-area">
      <h3 className="section-title">Upload File</h3>
      <p>Choose a file to securely upload to IPFS</p>
      <form onSubmit={handleSubmit}>
        <input
          disabled={!account || uploading}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          ref={fileInputRef}
        />
        <br />
        <button type="submit" className="btn-primary" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload to IPFS"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
