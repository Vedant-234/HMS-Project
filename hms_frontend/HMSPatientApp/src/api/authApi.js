import API from "./api";

/* 🔐 LOGIN */
export const loginApi = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (err) {
    console.log("LOGIN ERROR 👉", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

/* 🧾 REGISTER PATIENT */
export const registerApi = async (data) => {
  try {
    const res = await API.post("/auth/register/patient", data);
    return res.data;
  } catch (err) {
    console.log("REGISTER ERROR 👉", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

/* 🔁 CHANGE PASSWORD */
export const changePasswordApi = async (data) => {
  try {
    const res = await API.put("/auth/change-password", data);
    return res.data;
  } catch (err) {
    console.log("CHANGE PASSWORD ERROR 👉", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
