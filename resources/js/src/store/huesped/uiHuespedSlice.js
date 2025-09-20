import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    abrirModalHuesped: false,
};

export const uiHuespedSlice = createSlice({
    name: "varName",
    initialState,
    reducers: {
        rtkAbrirModalHuesped: (state, { payload }) => {
            state.abrirModalHuesped = payload;
        },
    },
});

export const { rtkAbrirModalHuesped } = uiHuespedSlice.actions;
