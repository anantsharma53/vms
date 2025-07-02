import React from 'react';
import Header from '../Header/Header';
import { useLocation } from 'react-router-dom';
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom';
import './FormPre.css';

const FormPreview = ({ formValues, setPreview }) => {
    const values = JSON.parse(formValues);
    console.log(values)
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');  // State to hold the API response message
    let token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log(values)
        fetch("http://127.0.0.1:8000/api/jharsewa-applicants/", {
            
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 201) {
                    return res.json();
                } else if (res.status === 401) {
                    setResponseMessage("Unauthorized request. Please log in again.");
                    navigate("/");
                    return null;
                } else {
                    return res.json().then((data) => {
                        throw new Error(data.detail || "Form submission failed.");
                    });
                }
            })
            .then((data) => {
                if (data && data.application_number) {
                    setResponseMessage(`Form submitted successfully! Your application number is: ${data.application_number}`);
                    setFormSubmitted(true);

                    setTimeout(() => {
                        setResponseMessage('');
                        navigate("/dashboard");
                        window.location.reload();
                    }, 5000);
                }
            })
            .catch((err) => {
                console.error(err);
                setResponseMessage(err.message);
            });
    };
    const handleBack = () => {
        setPreview(false); // Set preview to false to go back to the form
    };
    const calculateTotalExperience = () => {
        if (!values.experience || values.experience.length === 0) {
            return 0;
        }
        return values.experience.reduce((total, currentExp) => {
            return total + parseInt(currentExp.years, 10);
        }, 0);
    };

    return (
        <>
            {/* <Header /> */}


            <div className="applicant-details-container">
                {responseMessage && (
                    <div className="response-message" style={{ color: responseMessage.includes('successfully') ? 'green' : 'red', textAlign: 'center', margin: '10px 0' }}>
                        {responseMessage}
                    </div>
                )}
                <div className="header-section">
                    <div className="logo" >
                        <img
                            src="https://cdn.s3waas.gov.in/s313f320e7b5ead1024ac95c3b208610db/uploads/2020/09/2020091221.jpg"
                            alt="" style={{ height: '80px', width: 'auto' }} />
                        <p>
                            <strong>जिला जामताड़ा  </strong>
                            <br></br>
                            <strong>DISTRICT JAMTARA</strong>
                            <br></br>

                        </p>
                    </div>

                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <hr style={{ flex: 1, border: '1px solid black' }} />
                    <div style={{ padding: '0 10px', background: 'white', position: 'absolute', textAlign: 'center' }}>
                        <strong>JHARSEWA APPLICATION</strong>
                    </div>
                    <hr  />
                </div>

                <div className="single-row">
                    <div className="input-group">
                        <label htmlFor="post" style={{ marginRight: '10px' }}>Application Name </label>
                        <span>{values.post}</span>
                    </div>



                    <div className="input-group">
                        <label htmlFor="csc_id" style={{ marginRight: '10px' }}>CSC ID</label>
                        <span>{values.csc_id}</span>
                    </div>
                </div>
                <hr></hr>
                <div className="applicant-info-container">
                    <div className="form-left">
                        {/* Applicant Name */}
                        <label htmlFor="applicantName" style={{ marginRight: '10px' }}>Applicant Name</label>
                        <span>{values.applicantName}</span>

                        {/* Father Name */}
                        <label htmlFor="fatherName" style={{ marginRight: '10px' }}>Father Name</label>
                        <span>{values.fatherName}</span>

                        {/* Aadhaar Number */}
                        <div className="form-group">
                            <label htmlFor="aadhaar_number" style={{ marginRight: '10px' }}>Applicant Aadhaar Number</label>
                            <span>{values.aadhaar_number}</span>
                        </div>
                        {  /*Pan Cardinality */}
                        <div className="form-group">
                            <label htmlFor="pan" style={{ marginRight: '10px' }}>Applicant Pan Number</label>
                            <span>{values.pan}</span>
                        </div>

                        {/* Date of Birth */}
                        <div className="form-group">
                            <label htmlFor="dob" style={{ marginRight: '10px' }}>Date of Birth</label>
                            <span>{values.dob}</span>
                        </div>
                    </div>

                    <div className="form-right">
                        {/* User Picture */}
                        <div className="user-picture">
                            <img src="https://via.placeholder.com/150" alt="User" />
                            {/* src={`http://127.0.0.1:8000/${ApplicantData.image}`} */}
                        </div>

                        {/* Signature */}
                        <div className="user-signature">
                            <img src="https://via.placeholder.com/100x50" alt="Signature" />
                        </div>
                    </div>
                </div>

                <div className="permanent-address-box">
                    <h3>Permanent Address</h3>

                    {/* Second Row */}
                    <div className="address-row">
                        <div className="input-group">
                            <label htmlFor="village" style={{ marginRight: '10px' }}>Village</label>
                            <span>{values.village}</span>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="address-row">
                        <div className="input-group">
                            <label htmlFor="panchyat" style={{ marginRight: '10px' }}>Panchyat</label>
                            <span>{values.panchyat}</span>

                        </div>

                        <div className="input-group">
                            <label htmlFor="post_office" style={{ marginRight: '10px' }}>Post Office</label>
                            <span>{values.post_office}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="police_station" style={{ marginRight: '10px' }}>Police Station</label>
                            <span>{values.police_station}</span>
                        </div>
                    </div>

                    {/* Third Row */}
                    <div className="address-row">
                        <div className="input-group">
                            <label htmlFor="circle" style={{ marginRight: '10px' }}>Circle</label>
                            <span>{values.circle}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="district" style={{ marginRight: '10px' }}>District</label>
                            <span>{values.district}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="pin_code" style={{ marginRight: '10px' }}>Pincode</label>
                            <span>{values.pin_code}</span>
                        </div>
                    </div>
                </div>
                {/* Correspondent Address */}
                <div className="permanent-address-box">
                    <h3>Correspondent Address</h3>
                    <span>{values.correspondentAddress}</span>
                </div>
                <div className="form-row">
                    {/* Email */}
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <span>{values.email}</span>
                    </div>

                    {/* Mobile Number */}
                    <div className="form-field">
                        <label htmlFor="mobileNumber">Mobile Number</label>
                        <span>{values.mobileNumber}</span>
                    </div>

                    {/* Nationality */}
                    <div className="form-field">
                        <label htmlFor="nationality">Nationality</label>
                        <span>{values.nationality}</span>
                    </div>
                </div>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Disability Type</th>
                            <th>Disability Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{values.disability_type}</span>
                            </td>
                            <td>
                                <span>{values.disability_percentage}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Education</th>
                            <th>Board/University</th>
                            <th>Passing Year</th>
                            <th>Total Marks</th>
                            <th>Obtained Marks</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{values.education}</span>
                            </td>
                            <td>
                                <span>{values.boardUniversity}</span>
                            </td>
                            <td>
                                <span>{values.passingYear}</span>
                            </td>
                            <td>
                                <span>{values.total_marks}</span>
                            </td>
                            <td>
                                <span>{values.obtained_marks}</span>
                            </td>
                            <td>
                                <span>{values.percentage}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Residential Certificate Number</th>
                            <th>Residential Certificate Date</th>
                            <th>Caste Certificate Number</th>
                            <th>Caste Certificate Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{values.residential_certificate_number}</span>
                            </td>
                            <td>
                                <span>{values.residential_certificate_date}</span>
                            </td>
                            <td>
                                <span>{values.caste_certificate_number}</span>
                            </td>
                            <td>
                                <span>{values.caste_certificate_date}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Power Backup <br></br></th>
                            <th>Center Location</th>
                            <th>Internet Connectivity</th>
                            <th>Center Equipment </th>
                            <th>Active Services</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{values.power_backup}</span>
                            </td>
                            <td>
                                <span>{values.center_location}</span>
                            </td>
                            <td>
                                <span>{values.net_connection}</span>
                            </td>
                            <td>
                                <span>{values.center_equipments}</span>
                            </td>
                            <td>
                                <span>{values.active_services}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th >Is Ex-Serviceman</th>
                            <th>Has Criminal Case</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{values.is_ex_serviceman ? 'Yes' : 'No'}</span>

                            </td>
                            <td>
                                <span>{values.has_criminal_case ? 'Yes' : 'No'}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <label htmlFor="criminal_case_details">Criminal Case Details</label>
                                <span>{values.criminal_case_details}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Identification Marks</th>
                            <th>Explain</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="identification_mark_1"> Mark 1</label>
                            </td>
                            <td>
                                <span>{values.identification_mark_1}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="identification_mark_2">Mark 2</label>
                            </td>
                            <td>
                                <span>{values.identification_mark_2}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Category */}
                <div className="category-field">
                    <label htmlFor="category">Category</label>
                    <span>{values.category}</span>
                </div>
                <div className="gender-field">
                    {/* Gender Label */}
                    <label>Gender</label>
                    <span>{values.gender}</span>
                </div>
                {/* Declaration */}
                <div style={{ display: 'flex', alignItems: 'start', margin: '16px' }}>
                    <p style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                        I hereby declare that the information provided in this form is true, complete, and accurate to the best of my knowledge. I understand that any false statement or omission may result in disqualification from consideration or, if already employed, in disciplinary action, up to and including termination.
                        <br />
                        I further understand that submission of this form does not guarantee acceptance or approval, and decisions will be made based on the criteria specified by Organization.
                    </p>

                </div>

                <button onClick={handleBack} style={{ marginRight: '10px' }}>Back / Edit</button>
                <button onClick={handleSubmit} style={{ marginRight: '10px' }}> Submit</button>
            </div>

        </>
    );
};

export default FormPreview;
