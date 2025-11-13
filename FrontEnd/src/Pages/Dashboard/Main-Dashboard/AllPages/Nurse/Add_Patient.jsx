import React, { useState, useEffect } from "react";
import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import doctor from "../../../../../img/doctoravatar.png";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  AddPatients,
  EditSingleBed,
  GetSingleBed,
} from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { Navigate } from "react-router-dom";

const notify = (text) => toast(text);

const Add_Patient = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((store) => store.auth);

  // ------------------ IMAGE UPLOAD HANDLING ------------------
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // ------------------ FETCH DOCTORS ------------------
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/doctors");
        console.log(res.data);
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // ------------------ BED DETAILS ------------------
  const initBed = {
    bedNumber: "",
    roomNumber: "",
  };
  const [bedDetails, setbedDetails] = useState(initBed);

  const HandleBedchange = (e) => {
    setbedDetails({ ...bedDetails, [e.target.name]: e.target.value });
  };

  // ------------------ PATIENT DETAILS ------------------
  const InitData = {
    patientName: "",
    patientID: Date.now(),
    age: "",
    email: "",
    gender: "",
    mobile: "",
    disease: "",
    address: "",
    department: "",
    date: "",
    bloodGroup: "",
    DOB: "",
    password: "",
    nurseID: data?.user._id,
    docID: "",
    details: "",
    image: "",
  };

  const [AddPatient, setAddPatient] = useState(InitData);

  const HandleAppointment = (e) => {
    setAddPatient({ ...AddPatient, [e.target.name]: e.target.value });
  };

  // ------------------ SUBMIT FUNCTION ------------------
  const HandleOnsubmitAppointment = async (e) => {
    e.preventDefault();

    if (
      AddPatient.gender === "" ||
      AddPatient.department === "" ||
      AddPatient.docID === "" ||
      AddPatient.bloodGroup === ""
    ) {
      return notify("Please fill all the required fields");
    }

    try {
      setLoading(true);
      dispatch(GetSingleBed(bedDetails)).then((res) => {
        if (res.message === "Bed not found") {
          setLoading(false);
          return notify("Bed not found");
        }
        if (res.message === "Occupied") {
          setLoading(false);
          return notify("Bed already occupied");
        }
        if (res.message === "Available") {
          const patientData = {
            ...AddPatient,
            image: imageUrl || doctor,
          };

          dispatch(AddPatients(patientData)).then((item) => {
            if (item.message === "Patient already exists") {
              setLoading(false);
              return notify("Patient already exists");
            }

            let updateBedData = {
              patientID: item._id,
              occupied: "occupied",
            };

            notify("Patient Added Successfully");
            dispatch(EditSingleBed(updateBedData, res.id)).then(() =>
              notify("Bed Updated")
            );

            setLoading(false);
            setAddPatient(InitData);
            setbedDetails(initBed);
            setImageUrl("");
          });
        } else {
          setLoading(false);
          notify("Unexpected error occurred");
        }
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      notify("Failed to add patient");
    }
  };

  // ------------------ AUTH CHECK ------------------
  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "nurse") {
    return <Navigate to={"/dashboard"} />;
  }

  // ------------------ UI ------------------
  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1>Add Patient</h1>
            <img src={doctor} alt="doctor" className="avatarimg" />

            <form onSubmit={HandleOnsubmitAppointment}>
              {/* Patient Info */}
              <div>
                <label>Patient Name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="patientName"
                    value={AddPatient.patientName}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Age</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={AddPatient.age}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Email</label>
                <div className="inputdiv">
                  <input
                    type="email"
                    placeholder="abc@abc.com"
                    name="email"
                    value={AddPatient.email}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Date</label>
                <div className="inputdiv">
                  <input
                    type="date"
                    name="date"
                    value={AddPatient.date}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Gender</label>
                <div className="inputdiv">
                  <select
                    name="gender"
                    value={AddPatient.gender}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Birth Date</label>
                <div className="inputdiv">
                  <input
                    type="date"
                    name="DOB"
                    value={AddPatient.DOB}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Contact Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Number"
                    name="mobile"
                    value={AddPatient.mobile}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Disease</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Disease"
                    name="disease"
                    value={AddPatient.disease}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Address</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Address line 1"
                    name="address"
                    value={AddPatient.address}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Bed Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Bed No"
                    name="bedNumber"
                    value={bedDetails.bedNumber}
                    onChange={HandleBedchange}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Room Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Room No"
                    name="roomNumber"
                    value={bedDetails.roomNumber}
                    onChange={HandleBedchange}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Department</label>
                <div className="inputdiv">
                  <select
                    name="department"
                    value={AddPatient.department}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="ENT">ENT</option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Anesthesiologist">Anesthesiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Oncologist">Oncologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Doctor</label>
                <div className="inputdiv">
                  <select
                    name="docID"
                    value={AddPatient.docID}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
  {doc.doctorName || doc.docName || "Unnamed Doctor"}
</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label>Patient Blood Group</label>
                <div className="inputdiv">
                  <select
                    name="bloodGroup"
                    value={AddPatient.bloodGroup}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Password</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Password"
                    name="password"
                    value={AddPatient.password}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label>Upload Image</label>
                <div className="inputdiv">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={({ onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </div>
              </div>

              <button
                type="submit"
                className="formsubmitbutton"
                style={{ width: "20%" }}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Patient;
