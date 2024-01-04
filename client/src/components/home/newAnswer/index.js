import "./index.css";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router";
import Form from "../../baseComponents/form";
import Textarea from "../../baseComponents/textarea";
import { validateHyperlink } from "../../../tool";
import { useUser } from "../../../context/user";

//React component for the newAnswer
const NewAnswer = ({ handlePost, handleDelete = () => {} }) => {
  const { state } = useLocation();
  const { a = null } = state || {};
  const { qid } = useParams();
  const { user } = useUser();
  const [text, setText] = useState(a ? a.text : "");
  const [textErr, setTextErr] = useState("");
  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const ans = {
      text: text,
      ans_by: user,
    };

    if (a) {
      ans._id = a._id;
    }

    await handlePost(ans, qid);
  };
  return (
    <Form>
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <div>
          <button
            className="blue_btn"
            onClick={() => {
              postAnswer();
            }}
          >
            {a ? "Save" : "Post Answer"}
          </button>
          {a ? (
            <button
              className="blue_btn margin_left_20"
              onClick={() => {
                handleDelete(a._id);
              }}
            >
              Delete
            </button>
          ) : null}
        </div>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
