import React, { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { isValidEmail } from "../../tool";
import { useNavigate } from "react-router";
import { register } from "../../service/user";

//react component Register
const Register = () => {
  const navigate = useNavigate();

  const [usrn, setUsrn] = useState("");
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const [cpswd, setCpswd] = useState("");
  const [usrnErr, setUsrnErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pswdErr, setPswdErr] = useState("");
  const [cpswdErr, setCpswdErr] = useState("");

  const handleRegister = async () => {
    let isValid = true;

    if (!usrn) {
      setUsrnErr("Username cannot be empty");
      isValid = false;
    }

    if (!email) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailErr("Email is invalid");
      isValid = false;
    }

    if (!pswd) {
      setPswdErr("Password cannot be empty");
      isValid = false;
    } else if (pswd.includes(usrn)) {
      setPswdErr("Password cannot contain the username");
      isValid = false;
    } else if (pswd.includes(email)) {
      setPswdErr("Password cannot contain the email");
      isValid = false;
    }

    if (cpswd.localeCompare(pswd)) {
      setCpswdErr("Password does not match");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const userinfo = {
      username: usrn,
      email: email,
      password: pswd,
    };

    const res = await register(userinfo);

    if (res.status == 200 && res.data._id) {
      navigate("/login");
    }
  };

  return (
    <>
      <h1 className="text_align_center margin_bottom_50">Register</h1>
      <Form>
        <Input
          title={"Username"}
          id={"loginUsernameInput"}
          val={usrn}
          setState={setUsrn}
          err={usrnErr}
        />
        <Input
          title={"Email"}
          id={"loginEmailInput"}
          val={email}
          setState={setEmail}
          err={emailErr}
        />
        <Input
          title={"Password"}
          id={"loginPasswordInput"}
          type={"password"}
          val={pswd}
          setState={setPswd}
          err={pswdErr}
        />
        <Input
          title={"Confirm Password"}
          id={"loginConfirmPasswordInput"}
          type={"password"}
          val={cpswd}
          setState={setCpswd}
          err={cpswdErr}
        />
        <div className="btn_indicator_container">
          <div>
            <button
              className="blue_btn"
              onClick={() => {
                handleRegister();
              }}
            >
              sign-up
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

export default Register;
