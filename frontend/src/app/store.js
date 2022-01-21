import { configureStore } from "@reduxjs/toolkit";
import { twitterApi } from "../services/twitterApi";
export default configureStore({
  reducer: {
    [twitterApi.reducerPath]: twitterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(twitterApi.middleware),
});
