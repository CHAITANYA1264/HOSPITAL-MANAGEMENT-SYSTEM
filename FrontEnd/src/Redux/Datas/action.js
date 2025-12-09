import * as types from "./types";
import axios from "axios";

const BASE_URL = "https://hospital-management-system-backend-ikmh.onrender.com"; // 👈 Change this once when needed

// CreateReport
export const CreateReport = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_REPORT_REQUEST });
    const res = await axios.post(`${BASE_URL}/reports/create`, data);
    console.log(res);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.CREATE_REPORT_ERROR,
      payload: { message: error },
    });
  }
};

// GET DOCTOR DETAILS
export const GetDoctorDetails = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_DOCTOR_REQUEST });
    const res = await axios.get(`${BASE_URL}/doctors`);
    console.log(res);
  } catch (error) {
    dispatch({
      type: types.GET_DOCTOR_ERROR,
      payload: { message: error },
    });
  }
};

// ADD PATIENTS
export const AddPatients = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.ADD_PATIENT_REQUEST });
    const res = await axios.post(`${BASE_URL}/patients/register`, data);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.ADD_PATIENT_ERROR,
      payload: { message: error },
    });
  }
};

// ADD BEDS
export const CreateBeds = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.ADD_BED_REQUEST });
    const res = await axios.post(`${BASE_URL}/beds/add`, data);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.ADD_BED_ERROR,
      payload: { message: error },
    });
  }
};

// CREATE PAYMENT
export const CreatePayment = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_PAYMENT_REQUEST });
    const res = await axios.post(`${BASE_URL}/payments/add`, data);
    console.log(res.data);
  } catch (error) {
    dispatch({
      type: types.CREATE_PAYMENT_ERROR,
      payload: { message: error },
    });
  }
};

// GET BEDS
export const GetBeds = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_BED_REQUEST });
    const res = await axios.get(`${BASE_URL}/beds`);
    console.log(res);
    dispatch({
      type: types.GET_BED_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_BED_ERROR,
      payload: { message: error },
    });
  }
};

// CREATE BOOKING
export const CreateBooking = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_BOOKING_REQUEST });
    const res = await axios.post(`${BASE_URL}/appointments/create`, data);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

// ADD BED
export const AddBed = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.ADD_BEDS_REQUEST });
    const res = await axios.post(`${BASE_URL}/beds/add`, data);
    console.log(res);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.ADD_BEDS_ERROR,
      payload: { message: error },
    });
  }
};

// GET SINGLE BED
export const GetSingleBed = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SINGLE_BEDS_REQUEST });
    const res = await axios.post(`${BASE_URL}/beds/single`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// EDIT SINGLE BED
export const EditSingleBed = (data, id) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SINGLE_BEDS_REQUEST });
    const res = await axios.patch(`${BASE_URL}/beds/${id}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// DISCHARGE PATIENT
export const dischargePatient = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.DISCHARGE_PATIENT_REQUEST });
    const res = await axios.put(`${BASE_URL}/beds/discharge`, data);
    console.log(res);
    dispatch({
      type: types.DISCHARGE_PATIENT_SUCCESS,
      payload: { bed: res.data.bed },
    });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL PATIENTS
export const GetPatients = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_PATIENT_REQUEST });
    const res = await axios.get(`${BASE_URL}/patients`);
    console.log(res.data);
    dispatch({
      type: types.GET_PATIENT_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL DATA
export const GetAllData = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ALLDATA_REQUEST });
    const res = await axios.get(`${BASE_URL}/hospitals`);
    console.log(res.data);
    dispatch({
      type: types.GET_ALLDATA_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL APPOINTMENTS
export const GetAllAppointment = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_APPOINTMENT_DETAILS_REQUEST });
    const res = await axios.get(`${BASE_URL}/appointments`);
    dispatch({
      type: types.GET_APPOINTMENT_DETAILS_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// DELETE APPOINTMENT
export const DeleteAppointment = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.DELETE_APPOINTMENT_REQUEST });
    const res = await axios.delete(`${BASE_URL}/appointments/${id}`);
    console.log(res.data);
    dispatch({
      type: types.DELETE_APPOINTMENT_SUCCESS,
      payload: id,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL REPORTS
export const GetAllReports = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_REPORTS_REQUEST });
    const res = await axios.get(`${BASE_URL}/reports`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
