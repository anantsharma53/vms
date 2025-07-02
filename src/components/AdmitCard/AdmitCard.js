import './AdmitCard.css'
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

const AdmitCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { admitCardData } = location.state || {};

    if (!admitCardData) {
        return <p>No Admit Card data found.</p>;
    }
    console.log(admitCardData)

    const handlePrint = () => {
        // Open a new window for printing
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Admit Card</title>');
        printWindow.document.write('<style>@media print { .no-print { display: none; } }</style>');
        printWindow.document.write('</head><body >');

        // Ensure the element with the class 'admit-card-print' exists
        const printContent = document.querySelector('.admit-card-print');
        if (printContent) {
            printWindow.document.write(printContent.innerHTML);
        } else {
            printWindow.document.write('<p>Error: Admit Card content not found.</p>');
        }

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        navigate('/')

    };
    const instructions = [
        "Carry this admit card along with a valid ID proof (e.g., Aadhaar, Passport, Driving License).",
        "Report to the exam center at least 30 minutes before the examination start time.",
        "No entry is allowed after the specified reporting time.",
        "Electronic devices such as mobile phones, calculators, and smartwatches are strictly prohibited.",
        "Fill the OMR sheet or answer sheet as per the instructions provided by the invigilator.",
        "In case of any discrepancy in the admit card, report to the authorities immediately.",
    ];


    return (
        <>
            <Header />
            <div className='admit-card-print' style={styles.container}>
                {/* <AdmitCardSearchForm onSearch={handleSearch} /> */}
                <h1 style={styles.title}>Direct recruitment test for Chowkidari post -2024</h1>
                <h2 style={styles.subtitle}>Advertisment Number :- 01/2024</h2>
                <h3 style={styles.admitCardTitle}>ADMIT CARD</h3>
                <hr></hr>
                <div style={styles.row}>
                    <div style={styles.leftColumn}>
                        <p><strong>Candidate Name:</strong> {admitCardData.applicantName}</p>
                        <p><strong>Candidate's Father Name:</strong> {admitCardData.fatherName}</p>
                        <p><strong>Application Number:</strong> {admitCardData.application_number}</p>
                        <p><strong>Category:</strong> {admitCardData.category}</p>
                        <p><strong>Date Of Birth:</strong> {admitCardData.dob}</p>
                    </div>
                    <div style={styles.rightColumn}>
                        <p><strong>Roll Number:</strong> {admitCardData.roll_number}</p>

                        {/* Photo Section */}
                        <div style={styles.photoContainer}>
                            {admitCardData.image ? (
                                <img
                                    src={`http://127.0.0.1:8000/${admitCardData.image}`}
                                    alt="Candidate"
                                    style={styles.image}
                                />
                            ) : (
                                <div style={styles.placeholderPhoto}>Self-Attested<br />Recent Passport Size Photo</div>
                            )}
                            {/* <p style={styles.imageText}>Self-Attested<br />Recent Passport Size Photo</p> */}
                        </div>

                        {/* Signature Section */}
                        <div style={styles.signatureContainer}>
                            {admitCardData.signature ? (
                                <img
                                    src={`http://127.0.0.1:8000/${admitCardData.signature}`}
                                    alt="Signature"
                                    style={styles.signature}
                                />
                            ) : (
                                // <div style={styles.placeholderSignature}>Signature</div>
                                <div style={styles.placeholderSignature}>Signature</div>
                            )}

                        </div>
                    </div>



                </div>
                <div style={styles.row}>
                    <p><strong style={{ marginRight: '10px', }}>Bit Number</strong> {admitCardData.bit_number}&nbsp;
                        <strong style={{ marginRight: '10px' }}>Bit Village</strong> {admitCardData.bit_village}&nbsp;
                        <strong style={{ marginRight: '10px' }}>Village Name under Bit Village</strong> {admitCardData.village}</p>
                </div>

                <div >
                    <p><strong>Examination Centre:</strong> {admitCardData.exam_center_name}
                        <br></br><strong>Examination Date:</strong> {admitCardData.exam_date}
                        <br></br><strong>Exam Time:</strong> {admitCardData.exam_time}</p>
                </div>

                <div style={styles.section}>
                    <p><strong>Candidate’s Address:</strong>
                        {admitCardData.correspondentAddress}</p>
                </div>
                <div style={styles.signatureSection}>
                    <div>
                        {/* <p>Issued by</p> */}
                        <p style={styles.signatureano}>Signature of Issuing Authority</p>
                    </div>
                    <div>
                        {/* <p>Invigilator's Signature</p> */}
                        <p style={styles.signatureano}>Signature of Invigilator</p>
                    </div>
                    <div>
                        {/* <p>Candidate's Signature</p> */}
                        <p style={styles.signatureano}>Signature of Candidate</p>
                    </div>
                </div>
            <hr></hr>
            <div className="instructions-container">
                <p><strong>Instructions for the Candidate</strong></p>
                <ul className="instructions-list">
                    {instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                    ))}
                </ul>
            </div>
            </div>
            <button
                onClick={handlePrint}
                className="no-print"
                style={{
                    position: 'absolute',
                    marginTop: '30px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '10px 20px',
                    fontSize: '16px'
                }}
            >
                Print Admit Card
            </button>

        </>
    );
};

const styles = {
    container: {
        border: '2px solid #000',
        padding: '20px',
        width: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        textDecoration: 'underline',
        fontSize: '18px',
    },
    subtitle: {
        textAlign: 'center',
        fontSize: '16px',
    },
    admitCardTitle: {
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '20px 0',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    leftColumn: {
        width: '60%',
    },
    rightColumn: {
        width: '35%',
        textAlign: 'center',
    },
    image: {
        width: '100px',
        height: '120px',
        border: '1px solid #000',
    },
    imageText: {
        fontSize: '12px',
    },
    section: {
        marginBottom: '20px',
    },
    signatureSection: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '40px',
    },
    signature: {
        borderBottom: '1px solid #000',
        width: '150px',
        margin: '10px 0 0',
        textAlign: 'center',
    },
    signatureano: {
        borderTop: '1px solid #000',
        width: '150px',
        margin: '10px 0 0',
        textAlign: 'center',

    },
    photoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    image: {
        width: '150px',  // Adjust as needed
        height: '150px', // Adjust as needed
        borderRadius: '5px',
    },
    placeholderPhoto: {
        width: '150px',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        fontSize: '14px',
        color: '#888',
    },
    imageText: {
        textAlign: 'center',
    },
    signatureContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10px', // Adjust spacing as needed
    },
    signature: {
        width: '150px',  // Adjust as needed
        height: '50px',  // Adjust as needed
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
    },
    placeholderSignature: {
        width: '150px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        fontSize: '14px',
        color: '#888',
    },
    signatureText: {
        textAlign: 'center',
        marginTop: '5px', // Adjust spacing as needed
    },
    instructionscontainer :{
        marginTop: '20px',
        padding: '15px',
        border: "1px solid #ccc",
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
      },
      
      
};

export default AdmitCard;
















