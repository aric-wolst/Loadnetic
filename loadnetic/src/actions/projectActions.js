import axios from "axios";
import {
    GET_ERRORS,
    SET_CURRENT_PROJECT,
} from "./types";

// Set current team
export const setCurrentProject = project => {

    return {
        type: SET_CURRENT_PROJECT,
        payload: project
    };
};