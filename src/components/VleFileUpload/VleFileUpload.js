import React, { useState, useEffect } from "react";
import "./VleFileUpload.css"; // Import the CSS file

const VleFileUpload = ({ applicationNumber }) => {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({}); // Track already uploaded files

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    // Skip if the file is already uploaded
    if (uploadedFiles[name]) {
      setError(`${name} is already uploaded.`);
      return;
    }

    if (file) {
      // Validate file size
      if (name === "image" || name === "signature") {
        if (file.size / 1024 > 50) {
          setError(`${name} should be less than 50 KB.`);
          return;
        }
      } else if (file.size / (1024 * 1024) > 5) {
        setError(`${name} should be less than 5 MB.`);
        return;
      }

      setError("");
      setFiles((prevFiles) => ({ ...prevFiles, [name]: file }));

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prevPreviews) => ({ ...prevPreviews, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const formData = new FormData();
    formData.append("application_number", applicationNumber);
    Object.keys(files).forEach((key) => {
      formData.append(key, files[key]);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/applicantjharsewa/upload-files/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Files uploaded successfully.");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "File upload failed.");
      }
    } catch (err) {
      setError("An error occurred while uploading files.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/user-information/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch User Information");
        }

        const data = await response.json();
        setUserData(data);

        // Populate uploadedFiles based on application_details
        const { application_details } = data;
        if (application_details) {
          setUploadedFiles({
            image: application_details.image,
            signature: application_details.signature,
            aadhar_card: application_details.aadhar_card,
            pan_card: application_details.pan_card,
            center_outside: application_details.center_outside,
            center_inside: application_details.center_inside,
            computer_certificate: application_details.computer_certificate,
            authorised_certificate: application_details.authorised_certificate,
            application_form: application_details.application_form,
          });
        }
      } catch (error) {
        setError("Error fetching User Information");
        console.error(error);
      }
    };

    fetchUserData();
  }, [handleSubmit]);

  return (
    <div className="file-upload-container">
      <h2>Upload Files</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {Object.keys(uploadedFiles).map((key) => (
            <div className="form-group" key={key}>
              <label>
                {key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}:
              </label>
              {uploadedFiles[key] ? (
                <>
                <p className="already-uploaded">Already uploaded</p>
                </>
                
              ) : (
                <input
                  type="file"
                  name={key}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
              {previews[key] && (
                <img
                  src={previews[key]}
                  alt="Preview"
                  style={{ width: "50px", height: "50px", marginTop: "10px" }}
                />
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="submit-button">
          Upload
        </button>
      </form>
    </div>
  );
};

export default VleFileUpload;
