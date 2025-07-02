import React, { useEffect, useState } from "react";
import "./SuperAdminComplaintsView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faFilter,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

const SuperAdminComplaintsView = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolution, setResolution] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(3);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [forwardModalId, setForwardModalId] = useState(null);
  const [disposeModalId, setDisposeModalId] = useState(null);
  const [forwardRemarks, setForwardRemarks] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const userDetails = JSON.parse(localStorage.getItem("user_details") || "{}");
  const departmentId = userDetails?.department;
  const isSuperuser = userDetails?.is_superuser;

  const [filters, setFilters] = useState({
    complaint_id: "",
    category: isSuperuser ? "" : departmentId,
    start_date: "",
    end_date: "",
    status: "",
  });

  const toggleFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };

  const handlePrint = () => {
    window.print();
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/departments/");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const fetchComplaints = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://127.0.0.1:8000/api/complaintsview/?page=${page}&page_size=${pageSize}`;

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          url += `&${key}=${filters[key]}`;
        }
      });

      // If not superuser, enforce their department filter
      if (!isSuperuser && departmentId) {
        url += `&category=${departmentId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // const unresolved = data.results.filter(
        //   (c) => !c.resolution || c.resolution.trim() === ""
        // );

        setComplaints(data.results);
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.count / pageSize));
      } else {
        console.error("Failed to fetch complaints");
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchComplaints(1);
  };

  const handleClearFilters = () => {
    setFilters({
      complaint_id: "",
      category: isSuperuser ? "" : departmentId,
      start_date: "",
      end_date: "",
    });
    fetchComplaints(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchComplaints(newPage);
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const closeZoom = () => {
    setSelectedImage(null);
  };

  const handleAddResolution = (id) => {
    setSelectedComplaint(id);
    setResolution("");
  };

  const submitResolution = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/admincomplaints/${selectedComplaint}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution }),
        }
      );

      if (response.ok) {
        alert("Resolution added successfully!");
        setSelectedComplaint(null);
        fetchComplaints(currentPage);
      } else {
        alert("Failed to add resolution.");
      }
    } catch (error) {
      console.error("Error adding resolution:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
    if (isSuperuser) {
      fetchDepartments();
    }
  }, [filters]);
  console.log(departments);
  // ✅ Safe synchronous department name lookup
  const getDepartmentNameFromList = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "—";
  };
  const handleForward = async () => {
    if (!selectedDepartment) return alert("Select a department to forward to.");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:8000/api/complaint/${forwardModalId}/reassign/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            to_department: selectedDepartment,
            remarks: forwardRemarks,
          }),
        }
      );

      if (res.ok) {
        alert("Complaint forwarded successfully.");
        setForwardModalId(null);
        fetchComplaints(currentPage);
      } else {
        alert("Forwarding failed.");
      }
    } catch (error) {
      console.error("Forward error:", error);
    }
  };

  const handleDispose = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:8000/api/complaint/${disposeModalId}/dispose/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Complaint marked as disposed.");
        setDisposeModalId(null);
        fetchComplaints(currentPage);
      } else {
        alert("Disposing failed.");
      }
    } catch (error) {
      console.error("Dispose error:", error);
    }
  };

  return (
    <div className="complaints-container">
      <div className="header-buttons">
        <h1>All Department Visitor Complaints Details</h1>
        <div className="icons">
          <FontAwesomeIcon icon={faFilter} onClick={toggleFilterMenu} className="fa-icon" />
          <FontAwesomeIcon icon={faPrint} onClick={handlePrint} className="fa-icon" />
        </div>
      </div>

      {/* Filter Menu */}
      {filterMenuVisible && (
        <form className="filter-form" onSubmit={handleFilterSubmit}>
          <div className="filter-container">
            <input
              type="text"
              name="complaint_id"
              placeholder="Complaint ID"
              value={filters.complaint_id}
              onChange={handleFilterChange}
            />
            {isSuperuser && (
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="forwarded">Forwarded</option>
              <option value="accepted">Accepted</option>
              <option value="disposed">Disposed</option>
              <option value="admin_review">Admin Review</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
            />
            <button type="submit">Apply Filters</button>
            <button type="button" className="clear-btn" onClick={handleClearFilters}>
              Clear
            </button>
          </div>
        </form>
      )}

      {/* Complaints Table */}
      <table className="complaints-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Department</th>
            <th>Complaint</th>
            <th>Images</th>
            {/* <th>Resolution</th> */}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{getDepartmentNameFromList(parseInt(c.category))}</td>
              <td>{c.complaint_text}</td>
              <td>
                {c.images.map((img) => (
                  <img
                    key={img.id}
                    src={`http://127.0.0.1:8000${img.image}`}
                    alt="Complaint"
                    className="complaint-image"
                    onClick={() => handleImageClick(`http://127.0.0.1:8000${img.image}`)}
                  />
                ))}
              </td>
              {/* <td>{c.resolution || "—"}</td> */}
              <td>
                <div
                  className="status-label"
                  style={{ marginBottom: "8px", fontWeight: "bold", color: "#555" }}
                >
                  Status:{" "}
                  <span style={{ color: "red" }}>
                    {c.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div
                  className="status-label"
                  style={{ marginBottom: "8px", fontWeight: "bold", color: "#555" }}
                >
                  {/* Remarks:{" "} */}
                  <span
                    style={{
                      color: c.rejection_remarks
                        ? "red"
                        : c.resolution
                          ? "green"
                          : c.forward_remarks
                            ? "#007bff" // blue for forwarded
                            : "orange", // fallback: pending
                      fontWeight: "bold"
                    }}
                  >
                    {c.resolution
                      ? `Resolution: ${c.resolution}`
                      : c.forward_remarks
                        ? `Forwarded: ${c.forward_remarks}`
                        : c.rejection_remarks
                          ? `Rejected: ${c.rejection_remarks}`
                          : "Pending: At Concerned Department"}
                  </span>
                </div>

              </td>
              <td className="radio-actions">
                <label className="forward-icon">
                  <input
                    type="radio"
                    name={`action-${c.id}`}
                    onClick={() => {
                      setForwardModalId(c.id);
                      setSelectedDepartment("");
                      setForwardRemarks("");
                    }}
                  />{" "}
                  Forward
                </label>
                <label className="forward-icon">
                  <input
                    type="radio"
                    name={`action-${c.id}`}
                    onClick={() => setDisposeModalId(c.id)}
                  />{" "}
                  Dispose
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <FontAwesomeIcon icon={faAngleDoubleLeft}
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn"
        />
        <span>Page {currentPage} of {totalPages}</span>
        <FontAwesomeIcon icon={faAngleDoubleRight}
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn"
        />
      </div>

      {/* Zoom View */}
      {selectedImage && (
        <div className="zoom-overlay" onClick={closeZoom}>
          <div className="zoom-container">
            <img src={selectedImage} alt="Zoomed" className="zoom-image" />
          </div>
        </div>
      )}


      {forwardModalId && (
        <div className="resolution-overlay">
          <div className="resolution-container">
            <h3>Forward Complaint ID: {forwardModalId}</h3>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <textarea
              value={forwardRemarks}
              onChange={(e) => setForwardRemarks(e.target.value)}
              placeholder="Enter remarks"
            />
            <div className="modal-buttons">
              <button onClick={handleForward}>Submit</button>
              <button onClick={() => setForwardModalId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {disposeModalId && (
        <div className="resolution-overlay">
          <div className="resolution-container">
            <h3>Are you sure you want to dispose Complaint ID: {disposeModalId}?</h3>
            <div className="modal-buttons">
              <button onClick={handleDispose}>Yes, Dispose</button>
              <button onClick={() => setDisposeModalId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminComplaintsView;
