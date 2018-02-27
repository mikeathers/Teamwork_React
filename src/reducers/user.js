const userReducerDefaultState = [];

export default (state = userReducerDefaultState, action) => {
    switch (action.type) {
        case "SET_USER_AUTH":
            return action.user;
        default:
            return state;
    }
};