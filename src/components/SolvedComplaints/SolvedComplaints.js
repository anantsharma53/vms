import React, { useEffect, useState } from "react";
import "./SolvedComplaints.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faFilter, faPrint } from '@fortawesome/free-solid-svg-icons';

const SolvedComplaints = () => {
  const [departments, setDepartments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(3);
  const [filters, setFilters] = useState({
    complaint_id: "",
    category: "",
    start_date: "",
    end_date: "",
    status: ""
  });
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

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
    setFilters({
      complaint_id: "",
      category: "",
      start_date: "",
      end_date: "",
      status: ""
    });
    fetchComplaints(1);
  };

  const fetchComplaints = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://127.0.0.1:8000/api/solvedcomplaintsview/?page=${page}&page_size=100`; // fetch all for filtering

      Object.keys(filters).forEach((key) => {
        if (filters[key] && key !== "status") {
          url += `&${key}=${filters[key]}`;
        }
      });

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        let filteredResults = data.results.filter(
          (c) => c.status === "disposed" || c.status === "accepted"
        );

        if (filters.status) {
          filteredResults = filteredResults.filter(c => c.status === filters.status);
        }

        const startIdx = (page - 1) * pageSize;
        const paginated = filteredResults.slice(startIdx, startIdx + pageSize);

        setComplaints(paginated);
        setCurrentPage(page);
        setTotalPages(Math.ceil(filteredResults.length / pageSize));
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

  useEffect(() => {
    fetchComplaints();
    fetchDepartments();
  }, [filters]);

  return (
    <div className="complaints-container">
      <div className="header-buttons">
        <h1>Solved Complaints (Accepted / Disposed)</h1>
        <div className="icons">
          <FontAwesomeIcon icon={faFilter} onClick={toggleFilterMenu} className="fa-icon" />
          <FontAwesomeIcon icon={faPrint} onClick={() => window.print()} className="fa-icon" />
        </div>
      </div>

      {filterMenuVisible && (
        <form className="filter-form" onSubmit={handleFilterSubmit}>
          <div className="filter-container">
            <input type="text" name="complaint_id" placeholder="Complaint ID" value={filters.complaint_id} onChange={handleFilterChange} />
            <input type="text" name="category" placeholder="Category ID" value={filters.category} onChange={handleFilterChange} />
            <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
            <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="disposed">Disposed</option>
            </select>
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{getDepartmentNameFromList(parseInt(complaint.category))}</td>
              <td>{complaint.complaint_text}</td>
              <td>
                {complaint.images && complaint.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.image}
                    alt="Complaint"
                    className="complaint-image"
                    onClick={() => handleImageClick(`${image.image}`)}
                  />
                ))}
                {/* {complaint.images.map((img) => (
                  <img
                    key={img.id}
                    src={`http://127.0.0.1:8000${img.image}`}
                    alt="Complaint"
                    className="complaint-image"
                    onClick={() => handleImageClick(`http://127.0.0.1:8000${img.image}`)}
                  />
                ))} */}
              </td>
              <td style={{ fontWeight: "bold", color: complaint.status === "disposed" ? "green" : "blue" }}>
                {complaint.status.toUpperCase()}
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
    </div>
  );
};

export default SolvedComplaints;
