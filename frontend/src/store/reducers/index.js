import { combineReducers } from "redux";
// import { Upload } from "../../../../backend/db";
import Auth from "./auth.reducers";
import Uploading from "./upload.reducer";
import Biding from "./bid.reducer";

const reducers = combineReducers({
    auth: Auth,
    uploading: Uploading,
    biding: Biding,
})

export default reducers;