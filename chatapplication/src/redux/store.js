import { configureStore } from "@reduxjs/toolkit"
import { chatappreducer } from "./reducers";

 const store = configureStore({
  reducer: {
    chat: chatappreducer,
  },
});


export default store;