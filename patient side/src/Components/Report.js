import "./Report.css";
import "./about.css";
import "../index.css";
import NavBars from "../Sections/navbar";
import { FiHome } from "react-icons/fi";
import Footer from "../Sections/footer";
import ToTop from "../Sections/totop";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios";

const notify = (text) => toast(text);

function Report() {
  const { data } = useSelector((store) => store.auth);
  const [reports, setReports] = useState([]);

  // ✅ Fetch reports from backend based on logged-in patient email
  useEffect(() => {
    const fetchReports = async () => {
      if (data?.user?.email) {
        try {
          const res = await axios.get(
            `http://localhost:5000/reports/patient/${data.user.email}`
          );
          console.log(res.data);
          setReports(res.data);
        } catch (error) {
          console.error("Error fetching reports:", error);
          notify("No reports found for this email");
        }
      } else {
        notify("Please login to view your reports");
      }
    };
    fetchReports();
  }, [data?.user?.email]);

  return (
    <div>
      <ToastContainer />
      <NavBars />
      <div className="banner-wraper">
        <div className="page-banner">
          <div className="container">
            <div className="page-banner-entry text-center">
              <h1>Reports</h1>
              <nav aria-label="breadcrumb" className="breadcrumb-row">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={"/"}>
                      <FiHome />
                      Home
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {data?.isAuthenticated !== true ? (
        <div className="reportLogin">
          <h1>No reports available</h1>
          <h1>Please login !</h1>
        </div>
      ) : (
        <>
          {/* ✅ Reports Table */}
          <div className="reportTables">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Disease</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map((elem) => (
                    <tr key={elem._id}>
                      <td>{elem.patientName}</td>
                      <td>{elem.patientDisease}</td>
                      <td>{elem.docName}</td>
                      <td>{elem.docDepartment}</td>
                      <td>{elem.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No reports found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Individual Report Cards */}
          {reports.map((elem) => (
            <div className="reportContainer" key={elem._id}>
              <div className="reportHeading">
                <h1>HEALTH REPORT</h1>
              </div>
              <div className="reportDetail">
                <div>
                  <p>Doctor Name : {elem.docName}</p>
                  <p>Number : {elem.docMobile}</p>
                  <p>Department : {elem.docDepartment}</p>
                </div>
                <div>
                  <p>Patient Name : {elem.patientName}</p>
                  <p>Age : {elem.patientAge}</p>
                  <p>Gender : {elem.patientGender}</p>
                </div>
              </div>
              <div className="reportMedical">
                <div>
                  <p>Blood Group : </p>
                  <p>Disease :</p>
                  <p>Temperature : </p>
                  <p>Weight :</p>
                  <p>BP :</p>
                  <p>Blood Sugar :</p>
                  <p>Remarks :</p>
                </div>
                <div>
                  <p>{elem.patientBloodGroup}</p>
                  <p>{elem.patientDisease}</p>
                  <p>{elem.patientTemperature} °C</p>
                  <p>{elem.patientWeight} KG</p>
                  <p>{elem.patientBP} mm/hg</p>
                  <p>{elem.patientGlucose} mg/dl</p>
                  <p>{elem.extrainfo}</p>
                </div>
              </div>
              <div className="reportMedicines">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elem.medicines.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele.medName}</td>
                        <td>{ele.dosage}</td>
                        <td>{ele.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="reportDate">
                <p>Date : {elem.date}</p>
                <p>Time : {elem.time}</p>
              </div>
            </div>
          ))}
        </>
      )}

      <Footer />
      <ToTop />
    </div>
  );
}

export default Report;
