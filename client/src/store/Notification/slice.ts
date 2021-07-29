import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NOTIFICATION_TYPE} from "../../constants";

interface notificationState {
    display: boolean;
    message: string;
    type: NOTIFICATION_TYPE;
}

const initialState: notificationState = {
    display: false,
    message: "",
    type: NOTIFICATION_TYPE.NONE,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(
            state,
            action: PayloadAction<{ message: string; type: NOTIFICATION_TYPE }>
        ) {
            state.display = true;
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        hideNotification(state) {
            state.display = false;
        },
    },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice;
