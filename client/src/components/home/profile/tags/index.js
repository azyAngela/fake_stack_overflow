import React, { useEffect, useState } from "react";
import "./index.css";
import { useUser } from "../../../../context/user";
import TagList from "../../tags/tagList";
import { getUserTags as _getUserTags } from "../../../../service/tag";

const Tags = () => {
    const { user, token } = useUser();
    const [tlist, setTlist] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const res = await _getUserTags(token);
            if (res.status == 200) {
                setTlist(res.data);
            }
        };
        fetchData().catch((e) => console.log(e));
    }, [user]);
    return <TagList tlist={tlist} fromProfile={true} />;
};

export default Tags;
