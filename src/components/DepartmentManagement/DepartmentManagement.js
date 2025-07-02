import React, { useState, useEffect } from "react";
import "./DepartmentManagement.css";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    contactNumber: "",
    email: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch("http://127.0.0.1:8000/api/departments/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch departments");

      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching departments");
    }
  };

  const openModal = (department = null) => {
    setEditingDepartment(department);
    setIsModalVisible(true);
    setFormValues(
      department || {
        name: "",
        contactNumber: "",
        email: "",
        address: "",
        description: "",
      }
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingDepartment(null);
    setFormValues({
      name: "",
      contactNumber: "",
      email: "",
      address: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingDepartment ? "PUT" : "POST";
      const url = editingDepartment
        ? `http://127.0.0.1:8000/api/departments/${editingDepartment.id}/`
        : "http://127.0.0.1:8000/api/departments/";

      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) throw new Error("Failed to save department");

      await fetchDepartments();
      closeModal();
      alert(editingDepartment ? "Department updated" : "Department added");
    } catch (error) {
      console.error(error);
      alert("Error saving department");
    }
  };

  const deleteDepartment = async (departmentId) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://127.0.0.1:8000/api/departments/${departmentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete department");

      await fetchDepartments();
      alert("Department deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting department");
    }
  };

  return (
    <div className="user-management">
      <h2>Department Management</h2>
      <button className="add-user-btn" onClick={() => openModal()}>
        Add Department
      </button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact No.</th>
            <th>Email</th>
            <th>Address</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.name}</td>
              <td>{dept.contactNumber}</td>
              <td>{dept.email}</td>
              <td>{dept.address}</td>
              <td>{dept.description}</td>
              <td>
                <button className="edit-btn" onClick={() => openModal(dept)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteDepartment(dept.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingDepartment ? "Edit Department" : "Add Department"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Department Name"
                value={formValues.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Department Contact Number"
                value={formValues.contactNumber}
                onChange={handleInputChange}
                required
                pattern="[6-9][0-9]{9}"
                maxLength="10"
                title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
              />
              <input
                type="email"
                name="email"
                placeholder="Department Email"
                value={formValues.email}
                onChange={handleInputChange}
                required
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Enter a valid email address (e.g., example@domain.com)"
              />
              <textarea
                name="address"
                placeholder="Dept. Address"
                value={formValues.address}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formValues.description}
                onChange={handleInputChange}
              />
              <button type="submit" className="save-btn">
                {editingDepartment ? "Update" : "Add"}
              </button>
              <button type="button" className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
