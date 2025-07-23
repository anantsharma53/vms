import React, { useState, useEffect } from 'react';
import './AdminDefaultDashboard.css';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LabelList,
} from 'recharts';

const Icon = ({ name, className = "icon" }) => {
  const icons = {
    shield: "🛡️",
    home: "🏠",
    login: "🔑",
    chevronDown: "▼",
    user: "👤",
    settings: "⚙️",
    userCheck: "✅",
    search: "🔍",
    qrCode: "📱",
    calendar: "📅",
    clock: "⏰",
    fileText: "📄",
    shieldCheck: "🛡️",
    building: "🏢",
    checkCircle: "✓",
    phone: "📞",
    mail: "✉️",
    mapPin: "📍",
    globe: "🌐",
    reception: "💁",

  };

  return <span className={className}>{icons[name] || "•"}</span>;
};

const AdminDefaultDashboard = () => {
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [complaintsPerCategory, setComplaintsPerCategory] = useState({});
  const [resolvedComplaintsPerCategory, setResolvedComplaintsPerCategory] = useState({});
  const [pendingComplaintsPerCategory, setPendingComplaintsPerCategory] = useState({});
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchComplaintData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/complaint/count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTotalComplaints(data.total_complaints || 0);
        setComplaintsPerCategory(data.complaints_per_category || {});
        setResolvedComplaintsPerCategory(data.resolved_complaints_per_category || {});
        setPendingComplaintsPerCategory(data.pending_complaints_per_category || {});
      } catch (error) {
        setError(error.message);
      }
    };

    fetchComplaintData();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
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

  const getDepartmentNameFromList = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "—";
  };

  const COLORS = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
    "#ec4899", "#22d3ee", "#6366f1", "#f97316", "#14b8a6", "#84cc16"
  ];

  const chartData = Object.entries(complaintsPerCategory).map(([deptId, count]) => {
    const name = getDepartmentNameFromList(parseInt(deptId));
    const resolved = resolvedComplaintsPerCategory[deptId] || 0;
    const pending = pendingComplaintsPerCategory[deptId] || 0;
    const total = count;
    return {
      name,
      total,
      resolved,
      pending,
      resolvedPercentage: ((resolved / total) * 100),
    };
  });

  return (
    <div className="dashboard-container">
      <section >
        <div >
          <section className="features">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Visitor Complaint Dashboard</h2>
                <p className="section-description">
                  Overview of complaints received, solved, and pending across departments.
                </p>
              </div>

              <div className="features-grid">
                {/* Total Complaints */}
                <div className="feature-card primary">
                  {/* <div className="feature-icon primary">
                <Icon name="fileText" className="icon large" />
                </div> */}
                  <h3 className="feature-title">Total Complaints</h3>
                  <p className="feature-description">
                    Total complaints received in the system.
                  </p>
                  <p className="feature-highlight">{totalComplaints}</p>
                </div>

                {/* Categorywise Complaints */}
                <div className="feature-card secondary">
                  {/* <div className="feature-icon secondary">
                <Icon name="building" className="icon large" />
                </div> */}
                  <h3 className="feature-title">Departmentywise Complaints</h3>
                  <p className="feature-description">
                    Distribution of complaints department-wise.
                  </p>
                  <ul className="feature-list">
                    {Object.entries(complaintsPerCategory).length > 0 ? (
                      Object.entries(complaintsPerCategory).map(([category, count]) => (
                        <li className="feature-list-item" key={category}>
                          <Icon name="checkCircle" className="check-icon" />
                          {getDepartmentNameFromList(parseInt(category))}: {count}
                        </li>
                      ))
                    ) : (
                      <li>No data available</li>
                    )}
                  </ul>
                </div>

                {/* Solved Complaints */}
                <div className="feature-card accent">
                  {/* <div className="feature-icon accent">
                <Icon name="shieldCheck" className="icon large" />
              </div> */}
                  <h3 className="feature-title">Solved Complaints</h3>
                  <p className="feature-description">
                    Total solved complaints by each department.
                  </p>
                  <ul className="feature-list">
                    {Object.entries(resolvedComplaintsPerCategory).length > 0 ? (
                      Object.entries(resolvedComplaintsPerCategory).map(([category, count]) => (
                        <li className="feature-list-item" key={category}>
                          <Icon name="checkCircle" className="check-icon" />
                          {getDepartmentNameFromList(parseInt(category))}: {count}
                        </li>
                      ))
                    ) : (
                      <li>No data available</li>
                    )}
                  </ul>
                </div>

                {/* Pending Complaints */}
                <div className="feature-card primary">
                  {/* <div className="feature-icon primary">
                <Icon name="clock" className="icon large" />
              </div> */}
                  <h3 className="feature-title">Pending Complaints</h3>
                  <p className="feature-description">
                    Complaints awaiting resolution across departments.
                  </p>
                  <ul className="feature-list">
                    {Object.entries(pendingComplaintsPerCategory).length > 0 ? (
                      Object.entries(pendingComplaintsPerCategory).map(([category, count]) => (
                        <li className="feature-list-item" key={category}>
                          <Icon name="checkCircle" className="check-icon" />
                          {getDepartmentNameFromList(parseInt(category))}: {count}
                        </li>
                      ))
                    ) : (
                      <li>No data available</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <div className="charts-container" style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            <div className="chart-box">
              <h3>Total Complaints Per Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total">
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>Complaints Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={chartData} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>Solved Complaints (%)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="resolvedPercentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                  >
                    <LabelList dataKey="resolvedPercentage" position="inside" formatter={(value, entry) => `${entry.name}: ${value}%`} />
                    {chartData.map((entry, index) => (
                      <Cell key={`donut-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDefaultDashboard;
