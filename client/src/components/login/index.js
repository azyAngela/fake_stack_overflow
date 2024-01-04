import React, { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { useNavigate } from "react-router";
import { login as _login } from "../../service/user";
import { useUser } from "../../context/user";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [usrn, setUsrn] = useState("");
  const [pswd, setPswd] = useState("");
  const [usrnErr, setUsrnErr] = useState("");
  const [pswdErr, setPswdErr] = useState("");

  const handleLogin = async () => {
    let isValid = true;

    if (!usrn) {
      setUsrnErr("Username cannot be empty");
      isValid = false;
    }

    if (!pswd) {
      setPswdErr("Password cannot be empty");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const res = await _login({ username: usrn, password: pswd });
    if (res.status == 200 && res.data.username && res.data.token) {
      // alert("login success");
      login(res.data.username, res.data.token);
      navigate("/home");
    }
  };
  //Component
  return (
    <>
      <h1 className="text_align_center margin_bottom_50">login page</h1>
      <Form>
        <Input
          title={"Username"}
          id={"loginUsernameInput"}
          val={usrn}
          setState={setUsrn}
          err={usrnErr}
        />
        <Input
          title={"Password"}
          id={"loginPasswordInput"}
          type={"password"}
          val={pswd}
          setState={setPswd}
          err={pswdErr}
        />
        <div className="btn_indicator_container">
          <div>
            <button
              className="blue_btn"
              onClick={() => {
                handleLogin();
              }}
            >
              Login
            </button>
            <button
              className="blue_btn margin_left_20"
              onClick={() => {
                navigate(-1);
              }}
            >
              back
            </button>
          </div>
          <div className="mandatory_indicator">
            * indicates mandatory fields
          </div>
        </div>
      </Form>
    </>
  );
};

export default Login;
