import React, { useState, useEffect } from "react";
import './Profile.css'
import AdminDefaultDashboard from "../AdminDefaultDashboard/AdminDefaultDashboard";
const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    panchyat: "",
    village: "",
    username: "",
    email: "",
    mobile_number: "",
    is_candidate: false,
    is_staff: false,
    is_superuser: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/applicant-information/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/applicant-information/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const data = await response.json();
      console.log("Profile updated:", data);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="profile-container">
      
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Panchyat:</label>
          <input
            type="text"
            name="panchyat"
            value={userData.panchyat}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Village:</label>
          <input
            type="text"
            name="village"
            value={userData.village}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile_number"
            value={userData.mobile_number}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* <div>
          <label>Is Candidate:</label>
          <input
            type="checkbox"
            name="is_candidate"
            checked={userData.is_candidate}
            onChange={() => setUserData({
              ...userData,
              is_candidate: !userData.is_candidate
            })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Is Staff:</label>
          <input
            type="checkbox"
            name="is_staff"
            checked={userData.is_staff}
            onChange={() => setUserData({
              ...userData,
              is_staff: !userData.is_staff
            })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Is Superuser:</label>
          <input
            type="checkbox"
            name="is_superuser"
            checked={userData.is_superuser}
            onChange={() => setUserData({
              ...userData,
              is_superuser: !userData.is_superuser
            })}
            disabled={!isEditing}
          />
        </div> */}

        <div>
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && <button type="submit">Save</button>}
        </div>
      </form>
    </div>
    </>
  );
};

export default UserProfile;
