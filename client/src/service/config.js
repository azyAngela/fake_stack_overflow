import _axios from "axios";

const REACT_APP_API_URL = "http://localhost:8000";

const handleRes = (res) => {
    return res;
};

const handleErr = (err) => {
    console.log(err);
    if (err.response && err.response.data && err.response.data.errmsg) {
        alert(err.response.data.errmsg);
    } else {
        alert("An unexpected error occurred. Please try again later.");
    }
    return err;
};

const api = _axios.create({ withCredentials: true });
api.interceptors.request.use(handleRes, handleErr);
api.interceptors.response.use(handleRes, handleErr);

export { REACT_APP_API_URL, api };
