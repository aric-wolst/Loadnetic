import axios from "axios";
import {
    GET_ERRORS,
    SET_CURRENT_TEAM,
} from "./types";

// Set current team
export const setCurrentTeam = team => {

    return {
        type: SET_CURRENT_TEAM,
        payload: team
    };
};