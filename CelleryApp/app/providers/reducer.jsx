import {
    TOKEN_SUCCESSFUL_VERIFICATION,
    USER_SUCCESSFUL_AUTHENTICATED,
    USER_SUCCESSFUL_LOGOUT,
    USER_SUCCESSFUL_REGISTER
} from '../actions'

export const initialState = {
    currentUserLoggedIn: {
        id: null,
        userName: null,
        jwtToken: null,
        isRegistered: false
    }
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case USER_SUCCESSFUL_AUTHENTICATED:
            return {
                ...state,
                id: action.payload.id,
                userName: action.payload.userName,
                jwtToken: action.payload.jwtToken,
            };
        case USER_SUCCESSFUL_REGISTER:
            return {
                ...state,
                isRegistered: true
            };
        case USER_SUCCESSFUL_LOGOUT:
            return {
                ...state,
                id: null,
                userName: null,
                jwtToken: null,
                isRegistered: false
            };
        case TOKEN_SUCCESSFUL_VERIFICATION:
            return {
                ...state,
                userName: action.payload.user.userName,
                jwtToken: action.payload.jwtToken
            };
        default:
            return state;
    }
}
