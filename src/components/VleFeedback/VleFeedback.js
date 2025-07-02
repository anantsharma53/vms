import React, { useState, useEffect } from 'react';
import './VleFeedback.css';

const WriteFeedback = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all complaints on component mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace 'your_bearer_token' with the actual bearer token
        const response = await fetch('http://127.0.0.1:8000/api/complaintsview/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          
          // Access 'results' which contains the list of complaints
          const complaintsData = data.results || [];
          
          // Filter complaints where resolution is not null and feedback is null
          const resolvedComplaints = complaintsData.filter(
            (complaint) => complaint.resolution && !complaint.feedback
          );
          // Set complaints state
          setComplaints(resolvedComplaints);
        } else {
          console.error("Failed to fetch complaints");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
  
    fetchComplaints();
  }, []);
  

  const handleComplaintChange = (e) => {
    setSelectedComplaintId(e.target.value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!selectedComplaintId || !feedback) {
      setMessage('Please select a complaint and provide feedback.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/vlefeedback/${selectedComplaintId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaint_id: selectedComplaintId,
          feedback: feedback,
        }),
      });

      if (response.ok) {
        setMessage('Feedback submitted successfully!');
        setFeedback('');
        setSelectedComplaintId('');
      } else {
        setMessage('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="feedback-form-container">
      <h2>Write Feedback for Complaint</h2>

      <div className="form-group">
        <label htmlFor="complaint">Select Complaint:</label>
        <select
          id="complaint"
          value={selectedComplaintId}
          onChange={handleComplaintChange}
        >
          <option value="">Select a complaint</option>
          {complaints.map((complaint) => (
            <option key={complaint.id} value={complaint.id}>
              {complaint.id}-{complaint.category} - {complaint.complaint_text}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="feedback">Your Feedback:</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={handleFeedbackChange}
          rows="5"
          placeholder="Write your feedback here..."
        ></textarea>
      </div>

      <div className="form-group">
        <button onClick={handleSubmitFeedback} className="submit-btn">
          Submit Feedback
        </button>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default WriteFeedback;
