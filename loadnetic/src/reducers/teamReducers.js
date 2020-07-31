import { SET_CURRENT_TEAM } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
    team: {},
};

export default function(state = initialState, action) {

    switch (action.type) {
        case SET_CURRENT_TEAM:
            return {
                ...state,
                team: action.payload
            };
        default:
            return state;
    }
}