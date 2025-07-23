import React, { useEffect, useState } from "react";
import "./DisplayComplaints.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faFilter, faPrint } from '@fortawesome/free-solid-svg-icons';
import ComplaintReceipt from "../ComplaintReceipt/ComplaintReceipt";
import {Link} from 'react-router-dom';
const DisplayComplaints = () => {
  const [departments, setDepartments] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolution, setResolution] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(30);
  const [filters, setFilters] = useState({ complaint_id: "", category: "", start_date: "", end_date: "" });
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user_details"));
    if (userDetails?.is_superuser) setUserRole("admin");
    else if (userDetails?.department) setUserRole("department");
    else setUserRole("reception");
  }, []);

  const toggleFilterMenu = () => setFilterMenuVisible(!filterMenuVisible);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchComplaints(1);
  };

  const handleClearFilters = () => {
    setFilters({ complaint_id: "", category: "", start_date: "", end_date: "" });
    fetchComplaints(1);
  };

  const fetchComplaints = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://127.0.0.1:8000/api/complaintsview/?page=${page}&page_size=${pageSize}`;
      Object.keys(filters).forEach((key) => { if (filters[key]) url += `&${key}=${filters[key]}` });
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.results);
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.count / pageSize));
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/departments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getDepartmentNameFromList = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "—";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) fetchComplaints(newPage);
  };

  const handleImageClick = (url) => setSelectedImage(url);
  const closeZoom = () => setSelectedImage(null);

  const handleSeeResolution = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://127.0.0.1:8000/api/complaint-resolution/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSelectedComplaint(id);
    setShowResolutionModal(true);

    if (response.ok) {
      const data = await response.json();
      setResolution(data.resolution);
    } else {
      const errorData = await response.json();
      setResolution(errorData.error || "Resolution not available.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://127.0.0.1:8000/api/complaintsdetailview/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      alert("Complaint deleted successfully");
      fetchComplaints(currentPage);
    } else {
      alert("Failed to delete complaint");
    }
  };

  const handleViewReceipt = (id) => {
    setSelectedComplaintId(id);
    fetchReceiptData(id);
  };

  const fetchReceiptData = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://127.0.0.1:8000/api/complaintsdetailview/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setReceiptData(data);
      setShowReceipt(true);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchDepartments();
  }, [filters]);

  return (
    <div className="complaints-container">
      <div className="header-buttons">
        <h1>Complaints</h1>
        <div className="icons">
          <FontAwesomeIcon icon={faFilter} onClick={toggleFilterMenu} className="fa-icon" />
          <FontAwesomeIcon icon={faPrint} onClick={() => window.print()} className="fa-icon" />
        </div>
      </div>

      {filterMenuVisible && (
        <form className="filter-form" onSubmit={handleFilterSubmit}>
          <div className="filter-container">
            <input type="text" name="complaint_id" placeholder="Complaint ID" value={filters.complaint_id} onChange={handleFilterChange} />
            <input type="text" name="category" placeholder="Category" value={filters.category} onChange={handleFilterChange} />
            <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
            <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
            <button type="submit">Apply</button>
            <button type="button" onClick={handleClearFilters}>Clear</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dept</th>
            {/* <th>Complaint</th> */}
            <th>Status</th>
            <th>Images</th>
            <th>Document</th>
            <th>Actions / Vew</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{getDepartmentNameFromList(parseInt(complaint.category))}</td>
              {/* <td>{complaint.complaint_text}</td> */}
              <td><span className={`status-badge status-${complaint.status}`}>{complaint.status}</span></td>
              <td>
                {complaint.images && complaint.images.map((image) => (
                  <img
                    key={image.id}
                    src={`http://127.0.0.1:8000${image.image}`}
                    alt="Complaint"
                    className="complaint-image"
                    onClick={() => handleImageClick(`http://127.0.0.1:8000${image.image}`)}
                  />
                ))}
              </td>
              <td>
                {complaint.document && (
                  <a href={`http://127.0.0.1:8000${complaint.document}`} target="_blank" rel="noopener noreferrer">View</a>
                )}
              </td>
              <td>
                <Link to={`/complaints/${complaint.id}`} className="view-details-link">
                  View Details</Link>
                <button onClick={() => handleSeeResolution(complaint.id)}>See</button>
                <button onClick={() => handleViewReceipt(complaint.id)}>Print</button>
                {userRole === "reception" && <button onClick={() => handleDelete(complaint.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <FontAwesomeIcon icon={faAngleDoubleLeft} onClick={() => handlePageChange(currentPage - 1)} className="pagination-btn" />
        <span>Page {currentPage} of {totalPages}</span>
        <FontAwesomeIcon icon={faAngleDoubleRight} onClick={() => handlePageChange(currentPage + 1)} className="pagination-btn" />
      </div>

      {selectedImage && (
        <div className="zoom-overlay" onClick={closeZoom}>
          <div className="zoom-container">
            <img src={selectedImage} alt="Zoomed" className="zoom-image" />
          </div>
        </div>
      )}

      {showResolutionModal &&  (
        <div className="modal-overlay" onClick={() => setShowResolutionModal(false)}>
          <div className="resolution-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Resolution for {selectedComplaint}</h3>
            <p>{resolution}</p>
            <button onClick={() => setShowResolutionModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showReceipt && receiptData && (
        <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
        <ComplaintReceipt complaintData={receiptData} onClose={() => setShowReceipt(false)} /></div>
      )}
    </div>
  );
};

export default DisplayComplaints;

