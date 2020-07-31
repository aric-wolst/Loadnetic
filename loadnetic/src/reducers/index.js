import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import teamReducer from "./teamReducers";
import projectReducer from "./projectReducer";

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    team: teamReducer,
    project: projectReducer
});