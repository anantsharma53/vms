// import React, { useState, useEffect } from 'react';
// import './AddComplaint.css';

// const AddComplaint = () => {
//   const [category, setCategory] = useState('');
//   const [complaint, setComplaint] = useState('');
//   const [departments, setDepartments] = useState([]);
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   // Fetch departments for category dropdown
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch('http://127.0.0.1:8000/api/departments/', {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch departments");

//         const data = await response.json();
//         setDepartments(data);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//         alert("Failed to load departments.");
//       }
//     };

//     fetchDepartments();
//   }, []);

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const handleComplaintChange = (e) => {
//     setComplaint(e.target.value);
//   };

//   const handleImageChange = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       const updatedImages = [...images];
//       updatedImages[index] = file;
//       setImages(updatedImages);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const updatedPreviews = [...imagePreviews];
//         updatedPreviews[index] = reader.result;
//         setImagePreviews(updatedPreviews);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddImageField = () => {
//     if (images.length < 5) {
//       setImages([...images, null]);
//       setImagePreviews([...imagePreviews, '']);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!category || !complaint) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('category', category);
//     formData.append('complaint_text', complaint);

//     images.forEach((image) => {
//       if (image) {
//         formData.append('images', image);
//       }
//     });

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = JSON.parse(atob(token.split('.')[1]));
//       const userId = decodedToken?.user_id;

//       if (userId) {
//         formData.append('user', userId);
//       }

//       const response = await fetch('http://127.0.0.1:8000/api/complaints/', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         alert('Complaint submitted successfully! ID: ' + data.id);

//         // Reset form
//         setCategory('');
//         setComplaint('');
//         setImages([]);
//         setImagePreviews([]);
//       } else {
//         const errorData = await response.json();
//         console.error('Error:', errorData);
//         alert('Failed to submit the complaint.');
//       }
//     } catch (error) {
//       console.error('Error submitting complaint:', error);
//       alert('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <div className="complaint-form-container">
//       <h2>Submit a Complaint</h2>
//       <form onSubmit={handleSubmit} className="complaint-form">
//         {/* Department Dropdown */}
//         <div className="form-group">
//           <label htmlFor="category">Select Department:</label>
//           <select
//             id="category"
//             value={category}
//             onChange={handleCategoryChange}
//             required
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.id} value={dept.id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Complaint Textbox */}
//         <div className="form-group">
//           <label htmlFor="complaint">Your Complaint:</label>
//           <textarea
//             id="complaint"
//             value={complaint}
//             onChange={handleComplaintChange}
//             rows="5"
//             placeholder="Write your complaint here..."
//             required
//           ></textarea>
//         </div>

//         {/* Image Upload Fields */}
//         <div className="form-group">
//           <label>Upload Images (Optional):</label>
//           {images.map((_, index) => (
//             <div key={index} className="image-upload-field">
//               <input
//                 type="file"
//                 onChange={(e) => handleImageChange(e, index)}
//                 accept="image/*"
//               />
//               {imagePreviews[index] && (
//                 <div className="image-preview">
//                   <img src={imagePreviews[index]} alt={`Preview ${index + 1}`} />
//                 </div>
//               )}
//             </div>
//           ))}
//           {images.length < 5 && (
//             <button type="button" onClick={handleAddImageField} className="add-image-btn">
//               Add More Image
//             </button>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="form-group">
//           <button type="submit" className="submit-btn">
//             Submit Complaint
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddComplaint;
// import React, { useState, useEffect } from 'react';
// import './AddComplaint.css';

// const AddComplaint = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     mobile_number: '',
//     email: '',
//     village: '',
//     panchyat: '',
//     pin_code: '',
//     post_office: '',
//     police_station: '',
//     district: '',
//     correspondentAddress: '',
//     category: '',
//     complaint_text: '',
//   });

//   const [departments, setDepartments] = useState([]);
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch('http://127.0.0.1:8000/api/departments/', {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch departments");

//         const data = await response.json();
//         setDepartments(data);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//         alert("Failed to load departments.");
//       }
//     };

//     fetchDepartments();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       const updatedImages = [...images];
//       updatedImages[index] = file;
//       setImages(updatedImages);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const updatedPreviews = [...imagePreviews];
//         updatedPreviews[index] = reader.result;
//         setImagePreviews(updatedPreviews);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddImageField = () => {
//     if (images.length < 5) {
//       setImages([...images, null]);
//       setImagePreviews([...imagePreviews, '']);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       name, mobile_number, email,
//       village, panchyat, pin_code, post_office,
//       police_station, district, correspondentAddress,
//       category, complaint_text
//     } = formData;

//     if (!category || !complaint_text || !name || !mobile_number || !village || !panchyat || !pin_code) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const submissionData = new FormData();
//     for (const key in formData) {
//       submissionData.append(key, formData[key]);
//     }

//     images.forEach((image) => {
//       if (image) {
//         submissionData.append('images', image);
//       }
//     });

//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = JSON.parse(atob(token.split('.')[1]));
//       const userId = decodedToken?.user_id;

//       if (userId) {
//         submissionData.append('user', userId);
//       }

//       const response = await fetch('http://127.0.0.1:8000/api/complaints/', {
//         method: 'POST',
//         body: submissionData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         alert('Complaint submitted successfully! ID: ' + data.id);
//         setFormData({
//           name: '',
//           mobile_number: '',
//           email: '',
//           village: '',
//           panchyat: '',
//           pin_code: '',
//           post_office: '',
//           police_station: '',
//           district: '',
//           correspondentAddress: '',
//           category: '',
//           complaint_text: '',
//         });
//         setImages([]);
//         setImagePreviews([]);
//       } else {
//         const errorData = await response.json();
//         console.error('Error:', errorData);
//         alert('Failed to submit the complaint.');
//       }
//     } catch (error) {
//       console.error('Error submitting complaint:', error);
//       alert('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <div className="complaint-form-container">
//       <h2>Submit a Complaint</h2>
//       <form onSubmit={handleSubmit} className="complaint-form">
//         {/* Personal & Address Fields */}
//         {[
//           { label: "Full Name", name: "name" },
//           { label: "Mobile Number", name: "mobile_number" },
//           { label: "Email", name: "email" },
//           { label: "Village", name: "village" },
//           { label: "Panchyat", name: "panchyat" },
//           { label: "PIN Code", name: "pin_code" },
//           { label: "Post Office", name: "post_office" },
//           { label: "Police Station", name: "police_station" },
//           { label: "District", name: "district" },
//         ].map(({ label, name }) => (
//           <div className="form-group" key={name}>
//             <label htmlFor={name}>{label}:</label>
//             <input
//               type="text"
//               id={name}
//               name={name}
//               value={formData[name]}
//               onChange={handleChange}
//               required={["name", "mobile_number", "village", "panchyat", "pin_code"].includes(name)}
//             />
//           </div>
//         ))}

//         <div className="form-group">
//           <label htmlFor="correspondentAddress">Correspondent Address:</label>
//           <textarea
//             id="correspondentAddress"
//             name="correspondentAddress"
//             value={formData.correspondentAddress}
//             onChange={handleChange}
//             rows="2"
//           />
//         </div>

//         {/* Department Dropdown */}
//         <div className="form-group">
//           <label htmlFor="category">Select Department:</label>
//           <select
//             id="category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             required
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.id} value={dept.id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Complaint Text */}
//         <div className="form-group">
//           <label htmlFor="complaint_text">Your Complaint:</label>
//           <textarea
//             id="complaint_text"
//             name="complaint_text"
//             value={formData.complaint_text}
//             onChange={handleChange}
//             rows="5"
//             placeholder="Write your complaint here..."
//             required
//           ></textarea>
//         </div>

//         {/* Image Upload */}
//         <div className="form-group">
//           <label>Upload Images (Optional):</label>
//           {images.map((_, index) => (
//             <div key={index} className="image-upload-field">
//               <input
//                 type="file"
//                 onChange={(e) => handleImageChange(e, index)}
//                 accept="image/*"
//               />
//               {imagePreviews[index] && (
//                 <div className="image-preview">
//                   <img src={imagePreviews[index]} alt={`Preview ${index + 1}`} />
//                 </div>
//               )}
//             </div>
//           ))}
//           {images.length < 5 && (
//             <button type="button" onClick={handleAddImageField} className="add-image-btn">
//               Add More Image
//             </button>
//           )}
//         </div>

//         <div className="form-group">
//           <button type="submit" className="submit-btn">
//             Submit Complaint
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddComplaint;

import React, { useState, useEffect } from 'react';
import './AddComplaint.css';

const AddComplaint = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    email: '',
    village: '',
    panchyat: '',
    pin_code: '',
    post_office: '',
    police_station: '',
    district: '',
    correspondentAddress: '',
    category: '',
    complaint_text: '',
  });

  const [departments, setDepartments] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://127.0.0.1:8000/api/departments/', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch departments");

        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        alert("Failed to load departments.");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit mobile_number and pin_code length
    if (name === 'mobile_number' && value.length > 10) return;
    if (name === 'pin_code' && value.length > 6) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be under 5MB.");
        return;
      }

      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...imagePreviews];
        updatedPreviews[index] = reader.result;
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageField = () => {
    if (images.length < 5) {
      setImages([...images, null]);
      setImagePreviews([...imagePreviews, '']);
    }
  };

  const validateForm = () => {
    const {
      name, mobile_number, email,
      village, panchyat, pin_code,
      category, complaint_text
    } = formData;

    if (!name || !mobile_number || !village || !panchyat || !pin_code || !category || !complaint_text) {
      alert("Please fill in all required fields.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile_number)) {
      alert("Enter a valid 10-digit Indian mobile number.");
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Enter a valid email address.");
      return false;
    }

    if (!/^\d{6}$/.test(pin_code)) {
      alert("Enter a valid 6-digit PIN code.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }

    images.forEach((image) => {
      if (image) submissionData.append("images", image);
    });

    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.user_id) submissionData.append("user", payload.user_id);

      const response = await fetch('http://127.0.0.1:8000/api/complaints/', {
        method: 'POST',
        body: submissionData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert("Complaint submitted successfully! ID: " + data.id);
        setFormData({
          name: '',
          mobile_number: '',
          email: '',
          village: '',
          panchyat: '',
          pin_code: '',
          post_office: '',
          police_station: '',
          district: '',
          correspondentAddress: '',
          category: '',
          complaint_text: '',
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="complaint-form-container">
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="complaint-form">
        {[
          { label: "Full Name", name: "name", required: true },
          { label: "Mobile Number", name: "mobile_number", required: true },
          { label: "Email", name: "email", required: false },
          { label: "Village", name: "village", required: true },
          { label: "Panchyat", name: "panchyat", required: true },
          { label: "PIN Code", name: "pin_code", required: true },
          { label: "Post Office", name: "post_office", required: false },
          { label: "Police Station", name: "police_station", required: false },
          { label: "District", name: "district", required: false },
        ].map(({ label, name, required }) => (
          <div className="form-group" key={name}>
            <label htmlFor={name}>
              {label}{required && <span className="required">*</span>}:
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="correspondentAddress">Correspondent Address:</label>
          <textarea
            id="correspondentAddress"
            name="correspondentAddress"
            value={formData.correspondentAddress}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Select Department <span className="required">*</span>:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="complaint_text">
            Your Complaint <span className="required">*</span>:
          </label>
          <textarea
            id="complaint_text"
            name="complaint_text"
            value={formData.complaint_text}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Images (Optional, Max 5):</label>
          {images.map((_, index) => (
            <div key={index} className="image-upload-field">
              <input
                type="file"
                onChange={(e) => handleImageChange(e, index)}
                accept="image/*"
              />
              {imagePreviews[index] && (
                <div className="image-preview">
                  <img src={imagePreviews[index]} alt={`Preview ${index + 1}`} />
                </div>
              )}
            </div>
          ))}
          {images.length < 5 && (
            <button type="button" onClick={handleAddImageField} className="add-image-btn">
              Add More Image
            </button>
          )}
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComplaint;
