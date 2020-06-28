
export const initialState = {
    currentUserLoggedIn: {
        id: null,
        userName: null,
        jwtToken: null,
        isRegistered: false
    }
};

export const authReducer = (state,action)=>{
    switch (action.type) {
        case 'successfullyAuthenticated':
            console.log(`ACTION PAYLOAD `,action.payload);
            return {
                ...state,
                id: action.payload.id,
                userName: action.payload.userName,
                jwtToken: action.payload.jwtToken,
            };
        case 'successfullyRegistered':
            return {
                ...state,
                isRegistered: true
            };
        case 'successfullyLoggedOut':
            return {
                ...state,
                id:null,
                userName:null,
                jwtToken:null,
                isRegistered: false
            };
        default:
            return state;
    }
}
