import { configureStore } from "@reduxjs/toolkit";
import { loadState } from "./browserStorage";
import user from "./slices/user";

const store = configureStore({
    reducer: {
        user: user.reducer,
    },
    preloadedState: loadState(),
})

// const unsubscribe = store.subscribe(() => {
//     console.log(store.getState());
// })

export default store;