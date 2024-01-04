import React, { useState } from "react";
import Form from "../../baseComponents/form";
import Input from "../../baseComponents/input";
import Textarea from "../../baseComponents/textarea";
import "./index.css";
import { validateHyperlink } from "../../../tool";
import { useUser } from "../../../context/user";
import { useLocation } from "react-router";

//react component for the new question
const NewQuestion = ({ handlePost, handleDelete = () => {} }) => {
  const { state } = useLocation();
  const { q = null } = state || {};
  const { user } = useUser();
  const [title, setTitle] = useState(q ? q.title : "");
  const [text, setText] = useState(q ? q.text : "");
  const [tag, setTag] = useState(q ? q.tags.map((t) => t.name).join(" ") : "");

  const [titleErr, setTitleErr] = useState("");
  const [textErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");

  const postQuestion = async () => {
    let isValid = true;
    if (!title) {
      setTitleErr("Title cannot be empty");
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      isValid = false;
    }

    if (!text) {
      setTextErr("Question text cannot be empty");
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    let tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least 1 tag");
      isValid = false;
    } else if (tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      isValid = false;
    }

    for (let tag of tags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      return;
    }

    const question = {
      title: title,
      text: text,
      tags: tags,
      asked_by: user,
    };

    if (q) {
      question._id = q._id;
    }

    await handlePost(question);
  };

  return (
    <Form>
      <Input
        title={"Question Title"}
        hint={"Limit title to 100 characters or less"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <div className="btn_indicator_container">
        <div>
          <button
            className="blue_btn"
            onClick={() => {
              postQuestion();
            }}
          >
            {q ? "Save" : "Post Question"}
          </button>
          {q ? (
            <button
              className="blue_btn margin_left_20"
              onClick={() => {
                handleDelete(q._id);
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

export default NewQuestion;
