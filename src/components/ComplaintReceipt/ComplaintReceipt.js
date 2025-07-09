import React from 'react';
import './ComplaintReceipt.css';
import { useEffect, useState } from "react";

const ComplaintReceipt = ({ complaintData, onClose }) => {
  const [departments, setDepartments] = useState([]);
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
   useEffect(() => {
      fetchDepartments();
    }, );

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Complaint Receipt - ${complaintData.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .receipt-container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .receipt-title { font-size: 24px; font-weight: bold; }
            .office-name { font-size: 18px; margin-bottom: 10px; }
            .copy-label { font-weight: bold; margin: 15px 0 5px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .detail-item { margin-bottom: 8px; }
            .detail-label { font-weight: bold; }
            .instructions { margin-top: 30px; border-top: 1px dashed #333; padding-top: 15px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
              .receipt-container { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="office-name">Office of the District Magistrate-Cum-<br>Deputy Commissioner, Jamtara, Jharkhand</div>
              <div class="receipt-title">Welcome To Complaint Management System</div>
              <div class="copy-label">Complaint's Slip (Office Copy)</div>
            </div>
            
            <div class="details-grid">
              <div class="detail-item"><span class="detail-label">ID:</span> ${complaintData.id}   </div>
              
              <div class="detail-item"><span class="detail-label">Phone:</span> ${complaintData.mobile_number || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">Name:</span> ${complaintData.name || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">Address:</span> ${complaintData.correspondentAddress || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">City:</span> ${complaintData.district || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">State:</span> Jharkhand</div>
              <div class="detail-item"><span class="detail-label">Post Office:</span> ${complaintData.post_office || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">Pincode:</span> ${complaintData.pin_code || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">Police Station:</span> ${complaintData.police_station || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">Block:</span> ${complaintData.panchyat || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">District:</span> ${complaintData.district || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">Email:</span> ${complaintData.email || 'N/A'}</div>
              
              <div class="detail-item"><span class="detail-label">Department:</span>${getDepartmentNameFromList(parseInt(complaintData.category))}</div>
              <div class="detail-item"><span class="detail-label">Status:</span> ${complaintData.status || 'pending'}</div>
              <div class="detail-item"><span class="detail-label">Description:</span> ${complaintData.complaint_text || 'N/A'}</div>
              <div class="detail-item"><span class="detail-label">Created At:</span> ${new Date(complaintData.created_at).toLocaleString()}</div>
            </div>
            
            <div class="instructions">
              <h3>Instructions:</h3>
              <ul>
                <li>User's are advised to go to the respected department with this Visitor's Slip to get an Update</li>
                <li>User's Can Also Visit our website and enter Complaint ID to get an Update</li>
                
              </ul>
            </div>
            
            <div class="footer">
              <p>This is a computer generated receipt. No signature required.</p>
            </div>
          </div>
          
          
          
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="complaint-receipt-modal">
      <div className="receipt-content">
        <h2>Complaint Receipt Preview</h2>
        <div className="receipt-actions">
          <button onClick={handlePrint} className="print-btn">
            Print Receipt
          </button>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintReceipt;