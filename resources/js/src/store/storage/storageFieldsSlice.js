import { createSlice } from "@reduxjs/toolkit";

export const storageFieldsSlice = createSlice({
    name: "storageFields",
    initialState: {
        storageFields: null,
    },
    reducers: {
        onSetStorageFields: (state, { payload }) => {
            state.storageFields = payload;
        },
    },
});

export const { onSetStorageFields } = storageFieldsSlice.actions;
