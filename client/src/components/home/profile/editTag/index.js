import React, { useState } from "react";
import "./index.css";
import { useLocation, useNavigate } from "react-router";
import Form from "../../../baseComponents/form";
import Input from "../../../baseComponents/input";
import {
    editTag as _editTag,
    deleteTag as _deleteTag,
} from "../../../../service/tag";
import { useUser } from "../../../../context/user";

const EditTag = () => {
    const navigate = useNavigate();
    const { token } = useUser();
    const { state } = useLocation();
    const { t = {} } = state || {};
    const [tnameSt, setTnameSt] = useState(t.name || "");

    const handleSave = async () => {
        if (!tnameSt) {
            alert("Tag cannot be empty");
            return;
        }

        if (tnameSt.length > 20) {
            alert("Tag length cannot be more than 20");
            return;
        }

        const res = await _editTag({ _id: t._id, name: tnameSt }, token);
        if (res.status == 200 && res.data.tid) {
            alert("Save success!");
            navigate("/home/profile/tags");
        }
    };

    const handleDelete = async () => {
        const res = await _deleteTag(t._id, token);
        if (res.status == 200) {
            alert("Delete success!");
            navigate("/home/profile/tags");
        }
    };

    return (
        <Form>
            <Input
                title={"Tag name"}
                val={tnameSt}
                setState={setTnameSt}
                hint={"The length of tag name cannot be more than 20"}
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
                    <button
                        className="blue_btn margin_left_20"
                        onClick={() => {
                            handleDelete();
                        }}
                    >
                        Delete
                    </button>
                </div>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default EditTag;
