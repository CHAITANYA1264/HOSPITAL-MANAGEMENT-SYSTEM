import * as types from "./types";
import axios from "axios";

// Define a single API base URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// LOGIN NURSE
export const NurseLogin = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_NURSE_REQUEST });
    const res = await axios.post(`${API_BASE}/nurses/login`, data);
    dispatch({
      type: types.LOGIN_NURSE_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_NURSE_ERROR,
      payload: { message: error },
    });
  }
};

// LOGIN DOCTOR
export const DoctorLogin = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_DOCTOR_REQUEST });
    const res = await axios.post(`${API_BASE}/doctors/login`, data);
    dispatch({
      type: types.LOGIN_DOCTOR_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_DOCTOR_ERROR,
      payload: { message: error },
    });
  }
};

// LOGIN ADMIN
export const AdminLogin = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_ADMIN_REQUEST });
    const res = await axios.post(`${API_BASE}/admin/login`, data);
    dispatch({
      type: types.LOGIN_ADMIN_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_ADMIN_ERROR,
      payload: { message: error },
    });
  }
};

// REGISTER DOCTOR
export const DoctorRegister = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_DOCTOR_REQUEST });
    const res = await axios.post(`${API_BASE}/doctors/register`, data);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.REGISTER_DOCTOR_ERROR,
      payload: { message: error },
    });
  }
};

// REGISTER NURSE
export const NurseRegister = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_NURSE_REQUEST });
    const res = await axios.post(`${API_BASE}/nurses/register`, data);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.REGISTER_NURSE_ERROR,
      payload: { message: error },
    });
  }
};

// REGISTER ADMIN
export const AdminRegister = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_ADMIN_REQUEST });
    const res = await axios.post(`${API_BASE}/admin/register`, data);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.REGISTER_ADMIN_ERROR,
      payload: { message: error },
    });
  }
};

// REGISTER AMBULANCE
export const AmbulanceRegister = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_AMBULANCE_REQUEST });
    const res = await axios.post(`${API_BASE}/ambulances/add`, data);
    console.log(res);
  } catch (error) {
    dispatch({
      type: types.REGISTER_AMBULANCE_ERROR,
      payload: { message: error },
    });
  }
};

// LOGOUT
export const authLogout = () => async (dispatch) => {
  try {
    dispatch({ type: types.AUTH_LOGOUT });
  } catch (error) {
    console.log(error);
  }
};

// UPDATE NURSE
export const UpdateNurse = (data, id) => async (dispatch) => {
  try {
    dispatch({ type: types.EDIT_NURSE_REQUEST });
    const res = await axios.patch(`${API_BASE}/nurses/${id}`, data);
    dispatch({ type: types.EDIT_NURSE_SUCCESS, payload: res.data.user });
  } catch (error) {
    console.log(error);
  }
};

// UPDATE DOCTOR
export const UpdateDoctor = (data, id) => async (dispatch) => {
  try {
    dispatch({ type: types.EDIT_DOCTOR_REQUEST });
    const res = await axios.patch(`${API_BASE}/doctors/${id}`, data);
    dispatch({ type: types.EDIT_DOCTOR_SUCCESS, payload: res.data.user });
  } catch (error) {
    console.log(error);
  }
};

// SEND PASSWORD
export const SendPassword = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.EDIT_DOCTOR_REQUEST });
    const res = await axios.post(`${API_BASE}/admin/password`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// FORGET PASSWORD
export const forgetPassword = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.FORGET_PASSWORD_REQUEST });
    const res = await axios.post(`${API_BASE}/admin/forgot`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
