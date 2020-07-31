import { SET_CURRENT_PROJECT } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
    project: {},
};

export default function(state = initialState, action) {

    switch (action.type) {
        case SET_CURRENT_PROJECT:
            return {
                ...state,
                project: action.payload
            };
        default:
            return state;
    }
}