import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Header from '../Header/Header';
import './JobForm.css';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FormPreview from '../FormPre/FormPre';
import Menubar from '../HeaderMenu/HeaderMenu';
import VleFileUpload from '../VleFileUpload/VleFileUpload';
const initialValues = {
  post: '',
  application_number: '',
  applicantName: '',
  fatherName: '',
  gender: '',
  dob: '',
  village: '',
  panchyat: '',
  post_office: '',
  police_station: '',
  circle: '',
  district: '',
  pin_code: '',
  correspondentAddress: '',
  mobileNumber: '',
  aadhaar_number: '',
  disability_percentage: '',
  disability_type: '',
  education: '',
  boardUniversity: '',
  passingYear: '',
  total_marks: '',
  obtained_marks: '',
  percentage: '',
  residential_certificate_number: '',
  residential_certificate_date: '',
  category: '',
  caste_certificate_number: '',
  caste_certificate_date: 'null',
  application_status: '',
  remarks: '',
  email: '',
  declaration: false,
  csc_id: '',
  power_backup: '',
  center_location: '',
  net_connection: '',
  center_equipments: '',
  active_services: '',
  is_ex_serviceman: false,
  has_criminal_case: false,
  criminal_case_details: '',
  identification_mark_1: '',
  identification_mark_2: '',
  nationality: '',
  
};

const validationSchema = Yup.object({
  post: Yup.string().required('Required'),
  applicantName: Yup.string().required('Required'),
  fatherName: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  dob: Yup.date().required('Required'),
  village: Yup.string().required('Required'),
  panchyat: Yup.string().required('Required'),
  post_office: Yup.string().required('Required'),
  police_station: Yup.string().required('Required'),
  circle: Yup.string().required('Required'),
  district: Yup.string().required('Required'),
  pin_code: Yup.string().required('Required'),
  correspondentAddress: Yup.string().required('Required'),
  mobileNumber: Yup.string()
    .required('Required')
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits')
    .matches(/^\d{10}$/, 'Must contain only digits'),
  aadhaar_number: Yup.string().required('Required')
    .required('Required')
    .min(12, 'Must be exactly 12 digits')
    .max(12, 'Must be exactly 12 digits')
    .matches(/^\d{12}$/, 'Must contain only digits'),
  pan: Yup.string().required('Required'),
  disability_percentage: Yup.number(),
  disability_type: Yup.string().nullable(),
  education: Yup.string().required('Required'),
  boardUniversity: Yup.string().required('Required'),
  passingYear: Yup.number().required('Required'),
  total_marks: Yup.string().required('Required'),
  obtained_marks: Yup.string().required('Required'),
  percentage: Yup.number().required('Required'),
  residential_certificate_number: Yup.string(),
  residential_certificate_date: Yup.date(),
  category: Yup.string().required('Required'),
  caste_certificate_number: Yup.string(),
  caste_certificate_date: Yup.date(),  
  email: Yup.string().required('Required'),
  declaration: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  csc_id: Yup.string().required('Required'),
  power_backup: Yup.string().required('Required'),
  center_location: Yup.string().required('Required'),
  net_connection: Yup.string().required('Required'),
  center_equipments: Yup.string().required('Required'),
  active_services: Yup.string().required('Required'),
  is_ex_serviceman: Yup.boolean().oneOf([true, false]),
  has_criminal_case: Yup.boolean().oneOf([true, false]),
  criminal_case_details: Yup.string().nullable(),
  identification_mark_1: Yup.string().nullable(),
  identification_mark_2: Yup.string().nullable(),
  nationality: Yup.string().nullable(),
  
});


const JobApplicationForm = () => {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [ApplicantData, setApplicantData] = useState([]);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null)
  const [loader, setLoader] = useState(false); 
  const [preview, setPreview] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userData, setUserData] = useState(
    {
      name: '',
      email: '',
      mobile_number: ''
    }
  )
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/user-information/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch User Information");
        }

        const data = await response.json(); // Parse the JSON response
        setUserData(data); // Set user data to state
        
        // Check if application details exist and set them
        if (data.application_details && data.application_details.application_number) {
          setApplication(data.application_details.application_number);
          
        }
      } catch (error) {
        setError("Error fetching User Information");
        console.error(error);
      }
    };

    // Call the fetchUserData function when the component mounts
    fetchUserData();
  }, []); // Empty dependency array to run the effect only once

  // Log the userData and application for debugging
  useEffect(() => {
    console.log("UserData:", userData);
    console.log("Application Number:", application);

  }, [userData, application]);



  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Handle form submission

    },
  });



  const handlePreview = async () => {
    console.log(JSON.stringify(formik.values));
    // Trigger form validation
    const errors = await formik.validateForm();

    // Check if there are any validation errors
    const hasErrors = Object.keys(errors).length > 0;

    if (!hasErrors) {
      // If there are no errors, set preview to true
      setPreview(true);
      console.log(JSON.stringify(formik.values));
    } else {
      // If there are validation errors, set form as touched
      formik.setTouched(
        Object.keys(formik.values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  };

  console.log('Formik errors:', formik.errors);
  console.log(JSON.stringify(formik.values))


  console.log(ApplicantData)
  return (
    <>
      {!preview ?
        (<main className='form-container'>
          {loader ? (
            <Loader />
          )
            :
            application !=null ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p>Your form has been submitted successfully!</p>
                <p>Your Application Number :&nbsp;{application}</p>
                
                <VleFileUpload 
                applicationNumber={application}
                userId={application.userId}>

                </VleFileUpload>
              </div>
            ) : (
              <div >
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                  {/* Post */}
                  <div className="single-row">
                    <div className="input-group">
                      <label htmlFor="post">Application For </label>
                      <select {...formik.getFieldProps('post')} onBlur={() => formik.setFieldTouched('post')}>
                        <option value="" label="Select Application" />
                        <option value="JHARSEWA ID" label="JHARSEWA ID" />
                        {/* Add other options here */}
                      </select>
                      {formik.touched.post && formik.errors.post ? <div className="error">{formik.errors.post}</div> : null}
                    </div>
                    <div className="input-group">
                      <label htmlFor="csc_id">CSC ID</label>
                      <input
                        type="text"
                        id="csc_id"
                        {...formik.getFieldProps('csc_id')}
                        onBlur={() => formik.setFieldTouched('csc_id')}
                        onChange={(e) => formik.setFieldValue('csc_id', e.target.value)}
                      />
                      {formik.touched.csc_id && formik.errors.csc_id ? (
                        <div className="error">{formik.errors.csc_id}</div>
                      ) : null}
                    </div>
                  </div>

                  {/* Applicant Name */}
                  <label htmlFor="applicantName">Applicant Name</label>
                  <input
                    type="text"
                    id="applicantName"
                    {...formik.getFieldProps('applicantName')}
                    onBlur={() => formik.setFieldTouched('applicantName')}
                    onChange={(e) => formik.setFieldValue('applicantName', e.target.value.toUpperCase())}
                  />
                  {formik.touched.applicantName && formik.errors.applicantName ? (
                    <div className="error">{formik.errors.applicantName}</div>
                  ) : null}
                  {/* Father Name */}
                  <label htmlFor="fatherName">Father Name</label>
                  <input
                    type="text"
                    id="fatherName"
                    {...formik.getFieldProps('fatherName')}
                    onBlur={() => formik.setFieldTouched('fatherName')}
                    onChange={(e) => formik.setFieldValue('fatherName', e.target.value.toUpperCase())}
                  />
                  {formik.touched.fatherName && formik.errors.fatherName ? (
                    <div className="error">{formik.errors.fatherName}</div>
                  ) : null}
                  <div className="form-row-uid">
                    {/* Aadhaar Number */}
                    <div className="form-group">
                      <label htmlFor="aadhaar_number">Applicant Aadhaar Number</label>
                      <input
                        type="text"
                        id="aadhaar_number"
                        {...formik.getFieldProps('aadhaar_number')}
                        onBlur={() => formik.setFieldTouched('aadhaar_number')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          formik.setFieldValue('aadhaar_number', value);
                        }}
                      />
                      {formik.touched.aadhaar_number && formik.errors.aadhaar_number ? (
                        <div className="error">{formik.errors.aadhaar_number}</div>
                      ) : null}
                    </div>
                    {/*Pan Card Details*/}
                    <div className="form-group">
                      <label htmlFor="pan">Applicant Pan Number</label>
                      <input
                        type="text"
                        id="pan"
                        {...formik.getFieldProps('pan')}
                        onBlur={() => formik.setFieldTouched('pan')}
                        onChange={(e) => formik.setFieldValue('pan', e.target.value.toUpperCase())}
                      />
                      {formik.touched.pan && formik.errors.pan ? (
                        <div className="error">{formik.errors.pan}</div>
                      ) : null}
                    </div>

                    {/* Date of Birth */}
                    <div className="form-group">
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        {...formik.getFieldProps('dob')}
                        onBlur={() => formik.setFieldTouched('dob')}
                      />
                      {formik.touched.dob && formik.errors.dob ? (
                        <div className="error">{formik.errors.dob}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="permanent-address-box">
                    <h3>Permanent Address</h3>

                    {/* Second Row */}
                    <div className="address-row">
                      <div className="input-group">
                        <label htmlFor="village">Address (Village)</label>
                        <input
                          type="text"
                          id="village"
                          {...formik.getFieldProps('village')}
                          onBlur={() => formik.setFieldTouched('village')}
                          onChange={(e) => formik.setFieldValue('village', e.target.value.toUpperCase())}
                        />
                        {formik.touched.village && formik.errors.village ? (
                          <div className="error">{formik.errors.village}</div>
                        ) : null}
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="address-row">
                      <div className="input-group">
                        <label htmlFor="panchyat">Panchyat</label>
                        <input
                          type="text"
                          id="panchyat"
                          {...formik.getFieldProps('panchyat')}
                          onBlur={() => formik.setFieldTouched('panchyat')}
                          onChange={(e) => formik.setFieldValue('panchyat', e.target.value.toUpperCase())}
                        />
                        {formik.touched.panchyat && formik.errors.panchyat ? (
                          <div className="error">{formik.errors.panchyat}</div>
                        ) : null}
                      </div>

                      <div className="input-group">
                        <label htmlFor="post_office">Post Office</label>
                        <input
                          type="text"
                          id="post_office"
                          {...formik.getFieldProps('post_office')}
                          onBlur={() => formik.setFieldTouched('post_office')}
                          onChange={(e) => formik.setFieldValue('post_office', e.target.value.toUpperCase())}
                        />
                        {formik.touched.post_office && formik.errors.post_office ? (
                          <div className="error">{formik.errors.post_office}</div>
                        ) : null}
                      </div>

                      <div className="input-group">
                        <label htmlFor="police_station">Police Station</label>
                        <input
                          type="text"
                          id="police_station"
                          {...formik.getFieldProps('police_station')}
                          onBlur={() => formik.setFieldTouched('police_station')}
                          onChange={(e) => formik.setFieldValue('police_station', e.target.value.toUpperCase())}
                        />
                        {formik.touched.police_station && formik.errors.police_station ? (
                          <div className="error">{formik.errors.police_station}</div>
                        ) : null}
                      </div>
                    </div>

                    {/* Third Row */}
                    <div className="address-row">
                      <div className="input-group">
                        <label htmlFor="circle">Circle</label>
                        <input
                          type="text"
                          id="circle"
                          {...formik.getFieldProps('circle')}
                          onBlur={() => formik.setFieldTouched('circle')}
                          onChange={(e) => formik.setFieldValue('circle', e.target.value.toUpperCase())}
                        />
                        {formik.touched.circle && formik.errors.circle ? (
                          <div className="error">{formik.errors.circle}</div>
                        ) : null}
                      </div>

                      <div className="input-group">
                        <label htmlFor="district">District</label>
                        <input
                          type="text"
                          id="district"
                          {...formik.getFieldProps('district')}
                          onBlur={() => formik.setFieldTouched('district')}
                          onChange={(e) => formik.setFieldValue('district', e.target.value.toUpperCase())}
                        />
                        {formik.touched.district && formik.errors.district ? (
                          <div className="error">{formik.errors.district}</div>
                        ) : null}
                      </div>

                      <div className="input-group">
                        <label htmlFor="pin_code">Pincode</label>
                        <input
                          type="number"
                          id="pin_code"
                          {...formik.getFieldProps('pin_code')}
                          onBlur={() => formik.setFieldTouched('pin_code')}
                          onChange={(e) => formik.setFieldValue('pin_code', e.target.value.toUpperCase())}
                        />
                        {formik.touched.pin_code && formik.errors.pin_code ? (
                          <div className="error">{formik.errors.pin_code}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>


                  {/* Correspondent Address */}
                  <div className="permanent-address-box">
                    <h3>Correspondent Address</h3>
                    {/* <label htmlFor="correspondentAddress">Correspondent Address</label> */}
                    <input
                      type="text"
                      id="correspondentAddress"
                      {...formik.getFieldProps('correspondentAddress')}
                      onBlur={() => formik.setFieldTouched('correspondentAddress')}
                      onChange={(e) => formik.setFieldValue('correspondentAddress', e.target.value.toUpperCase())}
                    />
                    {formik.touched.correspondentAddress && formik.errors.correspondentAddress ? (
                      <div className="error">{formik.errors.correspondentAddress}</div>
                    ) : null}
                  </div>
                  <div className="form-row">
                    {/* Email */}
                    <div className="form-field">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        {...formik.getFieldProps('email')}
                        onBlur={() => formik.setFieldTouched('email')}
                        onChange={(e) => formik.setFieldValue('email', e.target.value.toUpperCase())}
                      />
                      {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                    </div>

                    {/* Mobile Number */}
                    <div className="form-field">
                      <label htmlFor="mobileNumber">Mobile Number</label>
                      <input
                        type="text"
                        id="mobileNumber"
                        {...formik.getFieldProps('mobileNumber')}
                        onBlur={() => formik.setFieldTouched('mobileNumber')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          formik.setFieldValue('mobileNumber', value);
                        }}
                      />
                      {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                        <div className="error">{formik.errors.mobileNumber}</div>
                      ) : null}
                    </div>

                    {/* Nationality */}
                    <div className="form-field">
                      <label htmlFor="nationality">Nationality</label>
                      <input
                        type="text"
                        id="nationality"
                        {...formik.getFieldProps('nationality')}
                        onBlur={() => formik.setFieldTouched('nationality')}
                        onChange={(e) => formik.setFieldValue('nationality', e.target.value.toUpperCase())}
                      />
                      {formik.touched.nationality && formik.errors.nationality ? (
                        <div className="error">{formik.errors.nationality}</div>
                      ) : null}
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
                          <input
                            type="text"
                            id="disability_type"
                            {...formik.getFieldProps('disability_type')}
                            onBlur={() => formik.setFieldTouched('disability_type')}
                            onChange={(e) => formik.setFieldValue('disability_type', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.disability_type && formik.errors.disability_type ? 'input-error' : ''}`}
                          />
                          {formik.touched.disability_type && formik.errors.disability_type ? (
                            <div className="error">{formik.errors.disability_type}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="disability_percentage"
                            {...formik.getFieldProps('disability_percentage')}
                            onBlur={() => formik.setFieldTouched('disability_percentage')}
                            onChange={(e) => formik.setFieldValue('disability_percentage', e.target.value)}
                            className={`form-input ${formik.touched.disability_percentage && formik.errors.disability_percentage ? 'input-error' : ''}`}
                          />
                          {formik.touched.disability_percentage && formik.errors.disability_percentage ? (
                            <div className="error">{formik.errors.disability_percentage}</div>
                          ) : null}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="form-table">
                    <thead>
                      <tr>
                        <th>Higher Education</th>
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
                          <input
                            type="text"
                            id="education"
                            {...formik.getFieldProps('education')}
                            onBlur={() => formik.setFieldTouched('education')}
                            onChange={(e) => formik.setFieldValue('education', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.education && formik.errors.education ? 'input-error' : ''}`}
                          />
                          {formik.touched.education && formik.errors.education ? (
                            <div className="error">{formik.errors.education}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="boardUniversity"
                            {...formik.getFieldProps('boardUniversity')}
                            onBlur={() => formik.setFieldTouched('boardUniversity')}
                            onChange={(e) => formik.setFieldValue('boardUniversity', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.boardUniversity && formik.errors.boardUniversity ? 'input-error' : ''}`}
                          />
                          {formik.touched.boardUniversity && formik.errors.boardUniversity ? (
                            <div className="error">{formik.errors.boardUniversity}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="passingYear"
                            {...formik.getFieldProps('passingYear')}
                            onBlur={() => formik.setFieldTouched('passingYear')}
                            onChange={(e) => formik.setFieldValue('passingYear', e.target.value)}
                            className={`form-input ${formik.touched.passingYear && formik.errors.passingYear ? 'input-error' : ''}`}
                          />
                          {formik.touched.passingYear && formik.errors.passingYear ? (
                            <div className="error">{formik.errors.passingYear}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="total_marks"
                            {...formik.getFieldProps('total_marks')}
                            onBlur={() => formik.setFieldTouched('total_marks')}
                            onChange={(e) => formik.setFieldValue('total_marks', e.target.value)}
                            className={`form-input ${formik.touched.total_marks && formik.errors.total_marks ? 'input-error' : ''}`}
                          />
                          {formik.touched.total_marks && formik.errors.total_marks ? (
                            <div className="error">{formik.errors.total_marks}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="obtained_marks"
                            {...formik.getFieldProps('obtained_marks')}
                            onBlur={() => formik.setFieldTouched('obtained_marks')}
                            onChange={(e) => formik.setFieldValue('obtained_marks', e.target.value)}
                            className={`form-input ${formik.touched.obtained_marks && formik.errors.obtained_marks ? 'input-error' : ''}`}
                          />
                          {formik.touched.obtained_marks && formik.errors.obtained_marks ? (
                            <div className="error">{formik.errors.obtained_marks}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="percentage"
                            {...formik.getFieldProps('percentage')}
                            onBlur={() => formik.setFieldTouched('percentage')}
                            onChange={(e) => formik.setFieldValue('percentage', e.target.value)}
                            className={`form-input ${formik.touched.percentage && formik.errors.percentage ? 'input-error' : ''}`}
                          />
                          {formik.touched.percentage && formik.errors.percentage ? (
                            <div className="error">{formik.errors.percentage}</div>
                          ) : null}
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
                          <input
                            type="text"
                            id="residential_certificate_number"
                            {...formik.getFieldProps('residential_certificate_number')}
                            onBlur={() => formik.setFieldTouched('residential_certificate_number')}
                            onChange={(e) => formik.setFieldValue('residential_certificate_number', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.residential_certificate_number && formik.errors.residential_certificate_number ? 'input-error' : ''}`}
                          />
                          {formik.touched.residential_certificate_number && formik.errors.residential_certificate_number ? (
                            <div className="error">{formik.errors.residential_certificate_number}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="date"
                            id="residential_certificate_date"
                            {...formik.getFieldProps('residential_certificate_date')}
                            onBlur={() => formik.setFieldTouched('residential_certificate_date')}
                            onChange={(e) => formik.setFieldValue('residential_certificate_date', e.target.value)}
                            className={`form-input ${formik.touched.residential_certificate_date && formik.errors.residential_certificate_date ? 'input-error' : ''}`}
                          />
                          {formik.touched.residential_certificate_date && formik.errors.residential_certificate_date ? (
                            <div className="error">{formik.errors.residential_certificate_date}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="caste_certificate_number"
                            {...formik.getFieldProps('caste_certificate_number')}
                            onBlur={() => formik.setFieldTouched('caste_certificate_number')}
                            onChange={(e) => formik.setFieldValue('caste_certificate_number', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.caste_certificate_number && formik.errors.caste_certificate_number ? 'input-error' : ''}`}
                          />
                          {formik.touched.caste_certificate_number && formik.errors.caste_certificate_number ? (
                            <div className="error">{formik.errors.caste_certificate_number}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="date"
                            id="caste_certificate_date"
                            {...formik.getFieldProps('caste_certificate_date')}
                            onBlur={() => formik.setFieldTouched('caste_certificate_date')}
                            onChange={(e) => formik.setFieldValue('caste_certificate_date', e.target.value)}
                            className={`form-input ${formik.touched.caste_certificate_date && formik.errors.caste_certificate_date ? 'input-error' : ''}`}
                          />
                          {formik.touched.caste_certificate_date && formik.errors.caste_certificate_date ? (
                            <div className="error">{formik.errors.caste_certificate_date}</div>
                          ) : null}
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
                          <input
                            type="text"
                            id="power_backup"
                            {...formik.getFieldProps('power_backup')}
                            onBlur={() => formik.setFieldTouched('power_backup')}
                            onChange={(e) => formik.setFieldValue('power_backup', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.power_backup && formik.errors.power_backup ? 'input-error' : ''}`}
                          />
                          {formik.touched.power_backup && formik.errors.power_backup ? (
                            <div className="error">{formik.errors.power_backup}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="center_location"
                            {...formik.getFieldProps('center_location')}
                            onBlur={() => formik.setFieldTouched('center_location')}
                            onChange={(e) => formik.setFieldValue('center_location', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.center_location && formik.errors.center_location ? 'input-error' : ''}`}
                          />
                          {formik.touched.center_location && formik.errors.center_location ? (
                            <div className="error">{formik.errors.center_location}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="net_connection"
                            {...formik.getFieldProps('net_connection')}
                            onBlur={() => formik.setFieldTouched('net_connection')}
                            onChange={(e) => formik.setFieldValue('net_connection', e.target.value)}
                            className={`form-input ${formik.touched.net_connection && formik.errors.net_connection ? 'input-error' : ''}`}
                          />
                          {formik.touched.net_connection && formik.errors.net_connection ? (
                            <div className="error">{formik.errors.net_connection}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="text"
                            id="center_equipments"
                            {...formik.getFieldProps('center_equipments')}
                            onBlur={() => formik.setFieldTouched('center_equipments')}
                            onChange={(e) => formik.setFieldValue('center_equipments', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.center_equipments && formik.errors.center_equipments ? 'input-error' : ''}`}
                          />
                          {formik.touched.center_equipments && formik.errors.center_equipments ? (
                            <div className="error">{formik.errors.center_equipments}</div>
                          ) : null}
                        </td>
                        <td>
                          <textarea
                            id="active_services"
                            {...formik.getFieldProps('active_services')}
                            onBlur={() => formik.setFieldTouched('active_services')}
                            onChange={(e) => formik.setFieldValue('active_services', e.target.value)}
                            className={`form-input ${formik.touched.active_services && formik.errors.active_services ? 'input-error' : ''}`}
                            rows="4"
                            placeholder="Enter Services Name provided by you"
                          />
                          {formik.touched.active_services && formik.errors.active_services ? (
                            <div className="error">{formik.errors.active_services}</div>
                          ) : null}
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
                          <input
                            type="checkbox"
                            id="is_ex_serviceman"
                            checked={formik.values.is_ex_serviceman}
                            onChange={(e) => formik.setFieldValue('is_ex_serviceman', e.target.checked)}
                            onBlur={() => formik.setFieldTouched('is_ex_serviceman')}
                          />
                          {formik.touched.is_ex_serviceman && formik.errors.is_ex_serviceman ? (
                            <div className="error">{formik.errors.is_ex_serviceman}</div>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            id="has_criminal_case"
                            checked={formik.values.has_criminal_case}
                            onChange={(e) => formik.setFieldValue('has_criminal_case', e.target.checked)}
                            onBlur={() => formik.setFieldTouched('has_criminal_case')}
                          />
                          {formik.touched.has_criminal_case && formik.errors.has_criminal_case ? (
                            <div className="error">{formik.errors.has_criminal_case}</div>
                          ) : null}
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
                          <input
                            type="text"
                            id="identification_mark_1"
                            {...formik.getFieldProps('identification_mark_1')}
                            onBlur={() => formik.setFieldTouched('identification_mark_1')}
                            onChange={(e) => formik.setFieldValue('identification_mark_1', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.identification_mark_1 && formik.errors.identification_mark_1 ? 'input-error' : ''}`}
                            placeholder="Enter Identification Mark 1"
                          />
                          {formik.touched.identification_mark_1 && formik.errors.identification_mark_1 ? (
                            <div className="error">{formik.errors.identification_mark_1}</div>
                          ) : null}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label htmlFor="identification_mark_2">Mark 2</label>
                        </td>
                        <td>
                          <input
                            type="text"
                            id="identification_mark_2"
                            {...formik.getFieldProps('identification_mark_2')}
                            onBlur={() => formik.setFieldTouched('identification_mark_2')}
                            onChange={(e) => formik.setFieldValue('identification_mark_2', e.target.value.toUpperCase())}
                            className={`form-input ${formik.touched.identification_mark_2 && formik.errors.identification_mark_2 ? 'input-error' : ''}`}
                            placeholder="Enter Identification Mark 2"
                          />
                          {formik.touched.identification_mark_2 && formik.errors.identification_mark_2 ? (
                            <div className="error">{formik.errors.identification_mark_2}</div>
                          ) : null}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  


                  {/* Category */}
                  <div className="category-field">
                    {/* Category Label */}
                    <label htmlFor="category">Category</label>
                    {/* Category Dropdown */}
                    <select
                      {...formik.getFieldProps('category')}
                      onBlur={() => formik.setFieldTouched('category')}
                    >
                      <option value="" label="Select a category" />
                      <option value="General" label="General" />
                      <option value="SC" label="SC" />
                      <option value="ST" label="ST" />
                      <option value="EWS" label="EWS" />
                      <option value="EBC-1" label="EBC-1" />
                      <option value="EBC-2" label="EBC-2" />
                    </select>

                    {/* Display Validation Errors */}
                    {formik.touched.category && formik.errors.category ? (
                      <div className="error">{formik.errors.category}</div>
                    ) : null}
                  </div>


                  {/* Gender */}
                  {/* // Inside the render code for Gender field */}
                  <div className="gender-field">
                    {/* Gender Label */}
                    <label>Gender</label>

                    {/* Gender Radio Buttons */}
                    <div role="group" aria-labelledby="gender">
                      <label>
                        <input
                          type="radio"
                          {...formik.getFieldProps('gender')}
                          value="MALE"
                          checked={formik.values.gender === 'MALE'}
                        />
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          {...formik.getFieldProps('gender')}
                          value="FEMALE"
                          checked={formik.values.gender === 'FEMALE'}
                        />
                        Female
                      </label>
                      <label>
                        <input
                          type="radio"
                          {...formik.getFieldProps('gender')}
                          value="TG"
                          checked={formik.values.gender === 'TG'}
                        />
                        TG
                      </label>
                    </div>

                    {/* Display Validation Errors */}
                    {formik.touched.gender && formik.errors.gender ? (
                      <div className="error" style={{ marginLeft: '15px' }}>{formik.errors.gender}</div>
                    ) : null}
                  </div>
                  {/* Declaration */}
                  <div style={{ display: 'flex', alignItems: 'start', margin: '16px' }}>

                    <label>
                      <span>
                        <input
                          type="checkbox"
                          id="declaration"
                          {...formik.getFieldProps('declaration')}
                          checked={formik.values.declaration}
                        />

                      </span>

                    </label><p style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                      I hereby declare that the information provided in this form is true, complete, and accurate to the best of my knowledge. I understand that any false statement or omission may result in disqualification from consideration or, if already employed, in disciplinary action, up to and including termination.
                      <br />
                      I further understand that submission of this form does not guarantee acceptance or approval, and decisions will be made based on the criteria specified by Organization.
                    </p>

                  </div>
                  {formik.touched.declaration && formik.errors.declaration ? (
                    <div className="error" >{formik.errors.declaration}</div>
                  ) : null}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {/* <button type="submit" style={{width:'30%'}}>Submit</button> */}

                  </div>

                </form>
                <button onClick={handlePreview} style={{ width: '95%', margin: '15px' }}>Preview</button>

              </div>
            )}
        </main>) :
        <FormPreview formValues={JSON.stringify(formik.values)} setPreview={setPreview} />
      }</>
  );
};

export default JobApplicationForm;


