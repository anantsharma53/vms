// ApplicantProfile.jsx
import React from 'react';
import './Displayform.css'; // Import the CSS file
import { useState, useEffect } from 'react';
import * as html2pdf from 'html2pdf.js';
const ApplicantProfile = () => {
    const [ApplicantData, setApplicantData] = useState([]);
    const [error, setError] = useState(null);
    // let token=localStorage.getItem("token");
    useEffect(() => {
        const fetchApplicantApplicantData = async () => {
            try {
                const token = localStorage.getItem("token"); // Replace 'your_bearer_token' with the actual bearer token
                const response = await fetch('http://127.0.0.1:8000/api/applicant-information/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch ApplicantData');
                }

                const data = await response.json();
                setApplicantData(data);
            } catch (error) {
                setError('Error fetching ApplicantData');
            }
        };

        fetchApplicantApplicantData();
    }, []);
    const pic = ApplicantData.image;
    if (!ApplicantData || ApplicantData.length === 0 || ApplicantData.image === null) {
        return <p>Please fill out the application form.</p>;
    }
    const calculateTotalExperience = () => {
        return ApplicantData.experience.reduce((total, currentExp) => {
            // Assuming years are represented as strings, convert to numbers for addition
            return (
                (parseFloat(total + parseFloat(currentExp.years, 10) / 12))

            );
        }, 0);
    };

    // ...

    // Use the function in your component
    { calculateTotalExperience() }

    const handleGeneratePDF = () => {
        const content = document.querySelector('.applicant-details-container');

        // Convert images to base64 and embed them in the HTML
        const images = content.querySelectorAll('img');
        images.forEach(async (img) => {
            const imageUrl = img.src;
            const base64Image = await getBase64Image(imageUrl);
            img.src = base64Image;
        });

        const pdfOptions = {
            margin: 10,
            filename: 'applicant_profile.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf(content, pdfOptions);
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
            throw error; // Rethrow the error to handle it at the higher level
        }
    };




    return (

        <div className="applicant-details-container">

            <div className="header-section">
                <div className="logo" >
                    <img
                        src="http://127.0.0.1:8000/media/images/jhlogo1.jpg"
                        alt="" style={{ height: '80px', width: 'auto' }} />
                    <p>
                        <strong>जिला जामताड़ा </strong>
                        <br></br>
                        <strong>DISTRICT JAMTARA</strong>
                    </p>
                </div>

            </div>
            <div style={{ margin: '0', marginBottom: '3px' }}>
                <hr style={{ margin: '0' }} />
                <p style={{ margin: '0', marginBottom: '3px' }}><strong>Post Name:</strong> &nbsp;&nbsp;&nbsp;{ApplicantData.post}</p>
                <p style={{ margin: '0', marginBottom: '3px' }}><strong>Application Number:</strong> &nbsp;&nbsp;&nbsp;{ApplicantData.application_number}</p>
                <hr style={{ margin: '0' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="personal-info">
                    <h2>Personal Information</h2>
                    <table className="applicant-info-table">
                        <tbody>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{ApplicantData.applicantName}</td>
                            </tr>
                            <tr>
                                <td><strong>Father's Name:</strong></td>
                                <td>{ApplicantData.fatherName}</td>
                            </tr>
                            <tr>
                                <td><strong>Date of Birth:</strong></td>
                                <td>{ApplicantData.dob}</td>
                            </tr>
                            <tr>
                                <td><strong>Correspondent Address:</strong></td>
                                <td>{ApplicantData.correspondentAddress}</td>
                            </tr>
                            <tr>
                                <td><strong>Permanent Address:</strong></td>
                                <td>{ApplicantData.permanentAddress}</td>
                            </tr>
                            <tr>
                                <td><strong>Mobile Number:</strong></td>
                                <td>{ApplicantData.mobileNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{ApplicantData.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Nationality:</strong></td>
                                <td>{ApplicantData.nationality}</td>
                            </tr>
                            <tr>
                                <td><strong>Category:</strong></td>
                                <td>{ApplicantData.category}</td>
                            </tr>
                            <tr>
                                <td><strong>Gender:</strong></td>
                                <td>{ApplicantData.gender}</td>
                            </tr>
                            <tr>
                                <td><strong>Physically Challenged:</strong></td>
                                <td>{ApplicantData.isPhysicallyChallenged ? 'Yes' : 'No'}</td>
                            </tr>
                        </tbody>
                    </table>


                </div>
                <div style={{ alignItems: 'center' }}>
                    <img className="profile-image" src={`http://127.0.0.1:8000/${ApplicantData.image}`} alt="Applicant Image" />
                </div>
            </div>
            <div className="pre-education-section">
                <h2>Education</h2>
                <table className="pre-education-container">
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Board/University</th>
                            <th>Passing Year</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ApplicantData.education && ApplicantData.education.map((edu, index) => (
                            <tr key={index} className="pre-education-item">
                                <td><strong>{edu.education}</strong></td>
                                <td>{edu.boardUniversity}</td>
                                <td> {edu.passingYear}</td>
                                <td> {edu.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <div className="experience-section">
                <h2>Experience</h2>
                <table className="experience-container">
                    <thead>
                        <tr>
                            <th>Organization</th>
                            <th>Years</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ApplicantData.experience.map((exp, index) => (
                            <tr key={index} className="experience-item">
                                <td><strong>{exp.organization}</strong></td>
                                <td>{exp.years}</td>
                                <td>{exp.remarks}</td>
                            </tr>
                        ))}
                        {/* Total Experience Row */}
                        <tr className="experience-item">
                            {/* <td colSpan="0"></td> */}
                            <td>Total Experience:</td>
                            <td colSpan="2">{calculateTotalExperience()} &nbsp; Years</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style={{ marginLeft: '10px', textAlign: 'justify' }}>
                I hereby declare that the information provided in this form is true, complete, and accurate to the best of my knowledge. I understand that any false statement or omission may result in disqualification from consideration or, if already employed, in disciplinary action, up to and including termination.
                <br />
                I further understand that submission of this form does not guarantee acceptance or approval, and decisions will be made based on the criteria specified by Organization.
            </p>
            <div className="image-section" >
                <div>
                    <p>Date:</p>
                    <p>Place:</p>
                </div>
                <div>
                    <img className="profile-signe" src={`http://127.0.0.1:8000/${ApplicantData.signature}`} alt="Applicant Signature" />
                    <p>Signature</p>
                </div>

            </div>
            <button onClick={handleGeneratePDF} style={{ width: '100%' }}>DownLoad your Application</button>
        </div>
    );
};

export default ApplicantProfile;
