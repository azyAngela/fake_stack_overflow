import React, { useState } from "react";
import "./index.css";
import Form from "../../../baseComponents/form";
import Input from "../../../baseComponents/input";
import { editUserInfo as _editUserInfo } from "../../../../service/user";
import { useUser } from "../../../../context/user";
import { useNavigate } from "react-router";

const UserInfo = ({ username, email }) => {
  const navigate = useNavigate();
  const { token, logout } = useUser();
  const [usrn, setUsrn] = useState(username);
  const [emailSt, setEmailSt] = useState(email);
  const handleSave = async () => {
    const res = await _editUserInfo({ username: usrn, email: emailSt }, token);
    if (res.status == 200) {
      alert("Save success, please relogin");
      logout();
      navigate("/");
    }
  };
  return (
    <>
      <Form>
        <Input
          title={"Username"}
          val={usrn}
          setState={setUsrn}
          id={"editUsername"}
        />
        <Input
          title={"Email"}
          val={emailSt}
          setState={setEmailSt}
          id="editEmail"
        />
        <div className="btn_indicator_container">
          <div>
            <button
              className="blue_btn"
              onClick={() => {
                handleSave();
              }}
            >
              Save
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

export default UserInfo;
