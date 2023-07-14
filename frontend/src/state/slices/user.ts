import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { UserDetails } from "../../types/authentication/types";

type State = {
    loggedIn: boolean
    details: UserDetails | null
};

const userSlice: Slice = createSlice({
    name: "user",
    initialState: {
        loggedIn: false, 
        details: null,
    } as State,
    reducers: {
        authenticate: (state: State, action: PayloadAction<UserDetails>) => {
            const user = action.payload;
            if (user !== undefined) {
                return {
                    loggedIn: true,
                    details: user,
                }
            }
            return state;
        },
        logout: () => {
            return {
                loggedIn: false,
                details: null,
            }
        }
    }
});

export default userSlice;