import React, { useState, useEffect } from 'react';
import './Allaplication.css';
import * as html2pdf from 'html2pdf.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight, faFilter, faPrint } from "@fortawesome/free-solid-svg-icons";
const ApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

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
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const toggleFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };
  const handleClearFilters = () => {

    setSelectedPost('');
    
    fetchData();
  };
  const handleOpenModal = (applicant) => {
    setSelectedApplicant(applicant);
    setStatus(applicant.application_status || '');
    setRemarks(applicant.remarks || '');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedApplicant) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/applicants/update_status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicant_id: selectedApplicant.id,
          application_status: status,
          remarks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      alert('Status updated successfully!');
      setShowModal(false);
      fetchData(currentPage);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };
  return (
    <>

      <div className="applicants-details-container">
       
        <div className="header-buttons">
          <h1>JharSewa Application </h1>
          <div className="icons">
            <FontAwesomeIcon icon={faFilter} onClick={toggleFilterMenu} className="fa-icon" />
            <FontAwesomeIcon icon={faPrint} onClick={handlePrintPDF} className="fa-icon" />
          </div>
        </div>
        <div>
          {/* Filter Menu */}
          {filterMenuVisible && (
            <form className="filter-form" >
              <div className="filter-container">
                <label htmlFor="postSelect">Application Type: </label>
                <select id="postSelect" value={selectedPost} onChange={handlePostChange}>
                  <option value="">Select a Application Type</option>
                  {/* Add options based on your available posts */}
                  <option value="JHARSEWA ID">JHARSEWA ID</option>
                  {/* <option value="post2">Post 2</option> */}
                  {/* ... */}
                </select>
                
                
                <button type="button" className="clear-btn" onClick={handleClearFilters}>
                  Clear
                </button>
              </div>
            </form>
          )}
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
                <th>center_location</th>
                <th>Address</th>
                <th>Image</th>
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
                  <td className="tabledesign">{applicant.center_location}</td>
                  <td className="tabledesign">Correspondent Address:<br></br>{applicant.correspondentAddress}
                    <td className="tabledesign">Permanent Address:<br></br>
                      Village:{applicant.village},
                      Bit_village:{applicant.bit_village},
                      Bit_number:{applicant.bit_number},
                      Panchyat:{applicant.panchyat},
                      Post office:{applicant.post_office},
                      Police station:{applicant.police_station},
                      Sub division{applicant.sub_division}
                      District:{applicant.district}
                      Pin code{applicant.pin_code}

                    </td>
                  </td>
                  <td className="tabledesign">
                    <img className="img-app" src={`http://localhost:8000${applicant.image}`} alt="Applicant" style={{
                      height: '120px',
                      maxWidth: '200px',
                    }} />
                  </td>
                  <td>
                    <button className="update-btn" onClick={() => handleOpenModal(applicant)}>Update Status</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="pagination-controls">
          <FontAwesomeIcon icon={faAngleDoubleLeft}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          />
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <FontAwesomeIcon icon={faAngleDoubleRight}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          />
        </div>
        {/* <button onClick={handlePrintPDF}>Print</button>
        <button onClick={handleGeneratePDF}>Generate PDF</button> */}
        {/*Update of Application */}
        {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Status</h2>
            <label>Status:</label>
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
            <label>Remarks:</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>
            <button onClick={handleSubmit} className='submit-btn'>Submit</button>
            <button onClick={() => setShowModal(false)} className='cancel-btn'>Cancel</button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ApplicantList;
