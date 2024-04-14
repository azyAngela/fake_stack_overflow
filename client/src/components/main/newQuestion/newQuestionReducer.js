import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            const newPost = action.payload;
            state.posts.push(newPost);
        },
    },
});

export const { addPost } = postSlice.actions;
export default postSlice.reducer;
