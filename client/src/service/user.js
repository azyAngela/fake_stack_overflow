import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;
// User service
const register = async (userinfo) => {
  const res = await api.post(`${USER_API_URL}/register`, userinfo);
  return res;
};

const login = async (userinfo) => {
  const res = await api.post(`${USER_API_URL}/login`, userinfo);
  return res;
};

const logout = async () => {
  const res = await api.post(`${USER_API_URL}/logout`);
  return res;
};

const getUserInfo = async (token) => {
  const res = await api.get(`${USER_API_URL}/getUserInfo`, {
    headers: { Authorization: token },
  });
  return res;
};

const editUserInfo = async (userinfo, token) => {
  const res = await api.put(`${USER_API_URL}/editUserInfo`, userinfo, {
    headers: { Authorization: token },
  });

  return res;
};

export { register, login, logout, getUserInfo, editUserInfo };
