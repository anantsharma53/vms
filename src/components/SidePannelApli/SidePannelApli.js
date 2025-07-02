import React, { useState, useEffect } from 'react';
// import './SidePannelApli.css';
import * as html2pdf from 'html2pdf.js';

const SideApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePostChange = (event) => {
    setSelectedPost(event.target.value);
  };

  const fetchData = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://127.0.0.1:8000/api/applicants/by_post/${selectedPost}/?page=${page}&page_size=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setApplicants(data.results);
      setTotalPages(Math.ceil(data.count / 5)); // Calculate total pages based on page_size
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedPost) {
      fetchData(currentPage);
    }
  }, [selectedPost, currentPage]);

  const handleGeneratePDF = () => {
    const content = document.querySelector('.applicants-details-container');

    // Convert images to base64 and embed them in the HTML
    const images = content.querySelectorAll('img');
    images.forEach(async (img) => {
      const imageUrl = img.src;
      const base64Image = await getBase64Image(imageUrl);
      img.src = base64Image;
    });

    const pdfOptions = {
      margin: 5,
      filename: `applicants_${selectedPost}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    };

    html2pdf().from(content).set(pdfOptions).save();
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getBase64Image = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error.message);
      throw error;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchData(newPage);
    }
  };

  return (
    <>
      
      <div className="applicants-details-container ">
        <label htmlFor="postSelect">Select Post: </label>
        <select id="postSelect" value={selectedPost} onChange={handlePostChange}>
          <option value="">Select a Post</option>
          {/* Add options based on your available posts */}
          <option value="CHOWKIDAR">CHOWKIDAR</option>
          {/* <option value="post2">Post 2</option> */}
          {/* ... */}
        </select>

        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, flexGrow: 1, textAlign: 'center' }}>Applicant Information</h2>
            <button onClick={handlePrintPDF} style={{ marginLeft: 'auto' }}>Print</button>
          </div>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Application Number</th>
                <th>Applicant Name</th>
                <th>Father's Name</th>
                <th>DOB</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Physically Challenged</th>
                <th>Image</th>
                <th>Signature</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, index) => (
                <tr key={applicant.id}>
                  <td className="tabledesign">{(currentPage - 1) * 5 + index + 1}</td>
                  <td className="tabledesign">{applicant.application_number}</td>
                  <td className="tabledesign">{applicant.applicantName}</td>
                  <td className="tabledesign">{applicant.fatherName}</td>
                  <td className="tabledesign">{applicant.dob}</td>
                  <td className="tabledesign">{applicant.mobileNumber}</td>
                  <td className="tabledesign">{applicant.email}</td>
                  <td className="tabledesign">{applicant.category}</td>
                  <td className="tabledesign">{applicant.gender}</td>
                  <td className="tabledesign">{applicant.isPhysicallyChallenged ? 'Yes' : 'No'}</td>
                  <td className="tabledesign">
                    <img className="img-app" src={`http://localhost:8000${applicant.image}`} alt="Applicant" style={{
                      height: '120px',
                      maxWidth: '200px',
                    }} />
                  </td>
                  <td className="tabledesign">
                    <img className="img-app" src={`http://localhost:8000${applicant.signature}`} alt="Signature" style={{
                      height: '100px',
                      maxWidth: '150px',
                    }} />
                  </td>
                  <td>print</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
        {/* <button onClick={handlePrintPDF}>Print</button>
        <button onClick={handleGeneratePDF}>Generate PDF</button> */}
      </div>
    </>
  );
};

export default SideApplicantList;
