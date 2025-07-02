import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// import './JobApplicationForm.css';  // Import the CSS file
import './AdmitCardSearch.css';

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  post: Yup.string().required('Post is required'),
  applicantName: Yup.string().required('Applicant Name is required'),
  fatherName: Yup.string().required('Father Name is required'),
  dob: Yup.date().required('Date of Birth is required').nullable(),
  correspondentAddress: Yup.string().required('Correspondent Address is required'),
  permanentAddress: Yup.string().required('Permanent Address is required'),
  mobileNumber: Yup.string().required('Mobile Number is required').matches(/^\d+$/, 'Mobile Number must be a valid number'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  nationality: Yup.string().required('Nationality is required'),
  education: Yup.array().of(
    Yup.object().shape({
      education: Yup.string().required('Education is required'),
      boardUniversity: Yup.string().required('Board/University is required'),
      passingYear: Yup.string().required('Passing Year is required').matches(/^\d{4}$/, 'Passing Year must be a valid year'),
      percentage: Yup.string().required('Percentage is required').matches(/^\d+(\.\d+)?$/, 'Percentage must be a number'),
    })
  ),
  experience: Yup.array().of(
    Yup.object().shape({
      organization: Yup.string().required('Organization is required'),
      years: Yup.string().required('Years is required').matches(/^\d+$/, 'Years must be a valid number'),
      remarks: Yup.string().required('Remarks are required'),
    })
  ),
  category: Yup.string().required('Category is required'),
  gender: Yup.string().required('Gender is required'),
  isPhysicallyChallenged: Yup.boolean(),
  image: Yup.mixed().required('Image is required'),
  signature: Yup.mixed().required('Signature is required'),
  declaration: Yup.boolean().oneOf([true], 'Declaration must be accepted'),
});

// Define the POST function using fetch
const postData = async (values) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(values).forEach((key) => {
      if (key === 'education' || key === 'experience') {
        formData.append(key, JSON.stringify(values[key]));
      } else if (key === 'image' || key === 'signature') {
        if (values[key]) { // Ensure file is present
          formData.append(key, values[key]);
        }
      } else {
        formData.append(key, values[key]);
      }
    });
  
    try {
      const response = await fetch('http://localhost:8000/api/applicants/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.detail || 'Unknown error'}`);
      }
  
      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  

// The Form Component
const JobApplicationForm = () => (
  <div className="form-container">
    <Formik
      initialValues={{
        post: '',
        applicantName: '',
        fatherName: '',
        dob: '',
        correspondentAddress: '',
        permanentAddress: '',
        mobileNumber: '',
        email: '',
        nationality: '',
        education: [
          { education: '', boardUniversity: '', passingYear: '', percentage: '' },
          { education: '', boardUniversity: '', passingYear: '', percentage: '' },
          { education: '', boardUniversity: '', passingYear: '', percentage: '' },
        ],
        experience: [
          { organization: '', years: '', remarks: '' },
          { organization: '', years: '', remarks: '' },
          { organization: '', years: '', remarks: '' },
        ],
        category: '',
        gender: '',
        isPhysicallyChallenged: false,
        image: null,
        signature: null,
        declaration: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        postData(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, values, handleBlur, touched, errors }) => (
        <Form>
          <div>
            <label htmlFor="post">Post</label>
            <select
              name="post"
              value={values.post}
              onChange={(e) => setFieldValue('post', e.target.value)}
              onBlur={handleBlur}
            >
              <option value="" label="Select a post" />
              <option value="post1" label="Post 1" />
              <option value="post2" label="Post 2" />
              {/* Add other options */}
            </select>
            {touched.post && errors.post ? <div className="error">{errors.post}</div> : null}
          </div>

          <div>
            <label htmlFor="applicantName">Applicant Name</label>
            <Field name="applicantName" type="text" />
            <ErrorMessage name="applicantName" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="fatherName">Father Name</label>
            <Field name="fatherName" type="text" />
            <ErrorMessage name="fatherName" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="dob">Date of Birth</label>
            <Field name="dob" type="date" />
            <ErrorMessage name="dob" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="correspondentAddress">Correspondent Address</label>
            <Field name="correspondentAddress" type="text" />
            <ErrorMessage name="correspondentAddress" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="permanentAddress">Permanent Address</label>
            <Field name="permanentAddress" type="text" />
            <ErrorMessage name="permanentAddress" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <Field name="mobileNumber" type="text" />
            <ErrorMessage name="mobileNumber" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="nationality">Nationality</label>
            <Field name="nationality" type="text" />
            <ErrorMessage name="nationality" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <Field name="category" type="text" />
            <ErrorMessage name="category" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <Field name="gender" type="text" />
            <ErrorMessage name="gender" component="div" className="error" />
          </div>
          <div>
            <label>
              <Field name="isPhysicallyChallenged" type="checkbox" />
              Physically Challenged
            </label>
          </div>
          <div>
            <label htmlFor="image">Image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
            />
            <ErrorMessage name="image" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="signature">Signature</label>
            <input
              id="signature"
              name="signature"
              type="file"
              accept="image/*"
              onChange={(event) => setFieldValue("signature", event.currentTarget.files[0])}
            />
            <ErrorMessage name="signature" component="div" className="error" />
          </div>
          <div>
            <label>
              <Field name="declaration" type="checkbox" />
              I declare that the information provided is correct.
            </label>
            <ErrorMessage name="declaration" component="div" className="error" />
          </div>
          <button type="submit" >Submit</button>
        </Form>
      )}
    </Formik>
  </div>
);

export default JobApplicationForm;
