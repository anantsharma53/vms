import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./AdminComplaints.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faFilter, faPrint } from '@fortawesome/free-solid-svg-icons';

const AdminComplaints = () => {
  const [departments, setDepartments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolution, setResolution] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(30);
  const [filters, setFilters] = useState({ complaint_id: "", category: "", start_date: "", end_date: "" });
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [forwardRemarks, setForwardRemarks] = useState("");
  const [acceptResolutionModalId, setAcceptResolutionModalId] = useState(null);
  const [rejectModalId, setRejectModalId] = useState(null);
  const [forwardModalId, setForwardModalId] = useState(null);

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

  const handleAcceptOpenModal = (id) => {
    setAcceptResolutionModalId(id);
    setResolution("");
  };

  const handleRejectOpenModal = (id) => {
    setRejectModalId(id);
    setResolution("");
  };

  const handleForwardOpenModal = (id) => {
    setForwardModalId(id);
    setForwardRemarks("");
  };


  const handleAccept = async () => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:8000/api/complaint/${acceptResolutionModalId}/accept/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ remarks: resolution }),
    });
    setAcceptResolutionModalId(null);
    fetchComplaints(currentPage);
  };

  const handleReject = async () => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:8000/api/complaint/${rejectModalId}/reject/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ remarks: resolution }),
    });
    setRejectModalId(null);
    fetchComplaints(currentPage);
  };

  const handleForward = async () => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:8000/api/complaints-forward/${forwardModalId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ remarks: forwardRemarks }),
    });
    setForwardModalId(null);
    fetchComplaints(currentPage);
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
            <button type="submit">Apply Filters</button>
            <button type="button" className="clear-btn" onClick={handleClearFilters}>Clear</button>
          </div>
        </form>
      )}

      <table className="complaints-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Department</th>
            <th>Complaint</th>
            <th>Media</th>
            <th>Details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{getDepartmentNameFromList((parseInt(complaint.category)))}</td>
              <td>{complaint.complaint_text}</td>
              <td>
                {complaint.images.map((img) => (
                  <img
                    key={img.id}
                    src={`http://127.0.0.1:8000${img.image}`}
                    alt="Complaint"
                    className="complaint-image"
                    onClick={() => handleImageClick(`http://127.0.0.1:8000${img.image}`)}
                  />
                ))}
              </td>
              <td>
                {/* New "View Details" column */}
                <Link to={`/complaints/${complaint.id}`} className="view-details-link">
                  View Details
                </Link>
              </td>
              <td className="radio-actions">
                {complaint.status === "admin_review" ? (
                  <div
                    className="status-label"
                    style={{ marginBottom: "8px", fontWeight: "bold", color: "#555" }}
                  >
                    Status:{" "}
                    <span style={{ color: "red" }}>
                      {complaint.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <>
                    <label className="accept-icon">
                      <input
                        type="radio"
                        name={`action-${complaint.id}`}
                        onClick={() => handleAcceptOpenModal(complaint.id)}
                      />{" "}
                      Accept
                    </label>
                    <label className="reject-icon">
                      <input
                        type="radio"
                        name={`action-${complaint.id}`}
                        onClick={() => handleRejectOpenModal(complaint.id)}
                      />{" "}
                      Reject
                    </label>
                    <label className="forward-icon">
                      <input
                        type="radio"
                        name={`action-${complaint.id}`}
                        onClick={() => handleForwardOpenModal(complaint.id)}
                      />{" "}
                      Forward
                    </label>
                  </>
                )}
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

      {/* Accept Modal */}
      {acceptResolutionModalId && (
        <div className="resolution-overlay">
          <div className="resolution-container">
            <h3>Enter Accept Remarks  for Complaint ID: {acceptResolutionModalId}</h3>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Enter Remarks here"
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleAccept}>Submit</button>
              <button onClick={() => setAcceptResolutionModalId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="resolution-overlay">
          <div className="resolution-container">
            <h3>Enter Reason to Reject Complaint ID: {rejectModalId}</h3>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Enter reason here"
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleReject}>Submit</button>
              <button onClick={() => setRejectModalId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {forwardModalId && (
        <div className="resolution-overlay">
          <div className="resolution-container">
            <h3>Enter Remarks to Forward Complaint ID: {forwardModalId}</h3>
            <textarea
              value={forwardRemarks}
              onChange={(e) => setForwardRemarks(e.target.value)}
              placeholder="Enter remarks"
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleForward}>Submit</button>
              <button onClick={() => setForwardModalId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
