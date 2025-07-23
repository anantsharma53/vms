// src/components/ComplaintDetails.jsx
import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas for converting HTML to image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import for icons
import { faDownload } from '@fortawesome/free-solid-svg-icons'; // Import specific icon

import './ComplaintDetails.css'; // Make sure this CSS file exists and is linked

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Ref for the content to be downloaded as PDF
    const complaintDetailsRef = useRef(null);

    // Function to fetch departments (same as in AdminComplaints)
    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:8000/api/departments/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    // Function to get department name from ID (same as in AdminComplaints)
    const getDepartmentNameFromList = (departmentId) => {
        // Ensure departmentId is a number
        const idNum = parseInt(departmentId);
        if (isNaN(idNum)) return "—"; // Handle cases where ID might not be a valid number

        const dept = departments.find((d) => d.id === idNum);
        return dept ? dept.name : "—";
    };

    useEffect(() => {
        const fetchComplaintDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found. Please log in.');
                    setLoading(false);
                    return;
                }

                // Fetch departments first
                await fetchDepartments();

                const response = await fetch(`http://127.0.0.1:8000/api/complaintsdetailview/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 404) {
                    setError('Complaint not found.');
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setComplaint(data);
            } catch (err) {
                console.error("Error fetching complaint details:", err);
                setError('Failed to load complaint details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaintDetails();
    }, [id]); // Re-run if ID changes


    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    const closeZoom = () => {
        setSelectedImage(null);
    };

    // --- PDF Download Functions ---

    const downloadComplaintDetailsPdf = async () => {
        if (!complaintDetailsRef.current) return;

        try {
            const input = complaintDetailsRef.current;
            const canvas = await html2canvas(input, { scale: 2 }); // Scale for better resolution
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' for A4 size
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`complaint_details_${complaint.id}.pdf`);
        } catch (error) {
            console.error("Error generating complaint details PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const downloadMediaPdf = async () => {
        if (!complaint || !complaint.images || complaint.images.length === 0) {
            alert("No media to download.");
            return;
        }

        try {
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' for A4 size
            const a4Width = 210; // mm
            const a4Height = 297; // mm

            for (let i = 0; i < complaint.images.length; i++) {
                const img = complaint.images[i];
                const imageUrl = `http://127.0.0.1:8000${img.image}`;

                // Fetch image as Blob to convert to Data URL
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    console.warn(`Could not fetch image: ${imageUrl}. Skipping.`);
                    continue;
                }
                const blob = await response.blob();
                const reader = new FileReader();

                const imageDataUrl = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });

                if (i > 0) {
                    pdf.addPage(); // Add a new page for each subsequent image
                }

                // Get image dimensions
                const image = new Image();
                image.src = imageDataUrl;
                await new Promise(resolve => image.onload = resolve); // Ensure image is loaded to get dimensions

                let imgOriginalWidth = image.width;
                let imgOriginalHeight = image.height;

                // Calculate aspect ratio to fit A4 page
                const ratio = Math.min(a4Width / imgOriginalWidth, a4Height / imgOriginalHeight);

                let imgDisplayWidth = imgOriginalWidth * ratio;
                let imgDisplayHeight = imgOriginalHeight * ratio;

                // Center the image on the A4 page
                const xPos = (a4Width - imgDisplayWidth) / 2;
                const yPos = (a4Height - imgDisplayHeight) / 2;

                pdf.addImage(imageDataUrl, 'JPEG', xPos, yPos, imgDisplayWidth, imgDisplayHeight, undefined, 'FAST');
            }

            pdf.save(`complaint_media_${complaint.id}.pdf`);
        } catch (error) {
            console.error("Error generating media PDF:", error);
            alert("Failed to generate media PDF. Some images might not be available or there was a network issue.");
        }
    };


    // --- Render Logic ---

    if (loading) {
        return <div className="complaint-details-container">Loading complaint details...</div>;
    }

    if (error) {
        return <div className="complaint-details-container error">{error}</div>;
    }

    if (!complaint) {
        return <div className="complaint-details-container">Complaint not found.</div>;
    }

    return (
        <div className="complaint-details-container">
            <div className="top-buttons">
                <button onClick={() => navigate(-1)} className="back-button">
                    &larr; Back to Complaints
                </button>
                <button onClick={downloadComplaintDetailsPdf} className="download-button">
                    <FontAwesomeIcon icon={faDownload} /> Download Details PDF
                </button>
                {complaint.images && complaint.images.length > 0 && (
                    <button onClick={downloadMediaPdf} className="download-button">
                        <FontAwesomeIcon icon={faDownload} /> Download Media PDF
                    </button>
                )}
            </div>

            <div ref={complaintDetailsRef} className="printable-content"> {/* Attach ref here */}
                <h1>Complaint Details - ID: {complaint.id}</h1>

                <div className="details-grid">
                    <div className="detail-item">
                        <strong>Complaint ID:</strong> {complaint.id}
                    </div>
                    <div className="detail-item">
                        <strong>Category:</strong> {getDepartmentNameFromList(complaint.category)}
                    </div>
                    <div className="detail-item full-width">
                        <strong>Complaint Text:</strong> {complaint.complaint_text}
                    </div>
                    <div className="detail-item">
                        <strong>Submitted By (Name):</strong> {complaint.user_name || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>Submitted By (User ID):</strong> {complaint.user}
                    </div>
                    <div className="detail-item">
                        <strong>Email:</strong> {complaint.email || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>Mobile Number:</strong> {complaint.mobile_number || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>Submission Date:</strong> {new Date(complaint.created_at).toLocaleString()}
                    </div>
                    <div className="detail-item">
                        <strong>Status:</strong> <span className={`status-${complaint.status.toLowerCase().replace(/_/g, '-')}`}>{complaint.status.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>

                    <div className="detail-item">
                        <strong>Correspondent Address:</strong> {complaint.correspondentAddress || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>Village:</strong> {complaint.village || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>Panchayat:</strong> {complaint.panchyat || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>Police Station:</strong> {complaint.police_station || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>Post Office:</strong> {complaint.post_office || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>District:</strong> {complaint.district || 'N/A'}
                    </div>
                    <div className="detail-item">
                        <strong>PIN Code:</strong> {complaint.pin_code || 'N/A'}
                    </div>

                    {complaint.department && (
                        <div className="detail-item">
                            <strong>Assigned Department:</strong> {getDepartmentNameFromList(complaint.department)}
                        </div>
                    )}
                    {complaint.resolution && (
                        <div className="detail-item full-width">
                            <strong>Resolution Remarks:</strong> {complaint.resolution}
                        </div>
                    )}
                    {complaint.accept_remarks && (
                        <div className="detail-item full-width">
                            <strong>Accepted Remarks:</strong> {complaint.accept_remarks}
                        </div>
                    )}
                    {complaint.rejection_remarks && (
                        <div className="detail-item full-width">
                            <strong>Rejection Remarks:</strong> {complaint.rejection_remarks}
                        </div>
                    )}
                    {complaint.forward_remarks && (
                        <div className="detail-item full-width">
                            <strong>Forward Remarks:</strong> {complaint.forward_remarks}
                        </div>
                    )}
                    {complaint.forwarded_to && (
                        <div className="detail-item">
                            <strong>Forwarded To Department:</strong> {getDepartmentNameFromList(complaint.forwarded_to)}
                        </div>
                    )}
                    {complaint.feedback && (
                        <div className="detail-item full-width">
                            <strong>Feedback:</strong> {complaint.feedback}
                        </div>
                    )}
                </div>

                {complaint.images && complaint.images.length > 0 && (
                    <div className="detail-item full-width">
                        <strong>Attached Media (Thumbnails):</strong>
                        <div className="media-gallery">
                            {complaint.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={`http://127.0.0.1:8000${img.image}`}
                                    alt={`Complaint Media ${img.id}`}
                                    className="detail-image"
                                    onClick={() => handleImageClick(`http://127.0.0.1:8000${img.image}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div> {/* End printable-content div */}

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

export default ComplaintDetails;