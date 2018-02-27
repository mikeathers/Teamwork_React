const pageNumberReducerDefaultState = 1;

export default (state = pageNumberReducerDefaultState, action) => {
    switch (action.type) {
        case "SET_PAGE_NUMBER": 
            return action.pageNumber;            
        default:
            return state;
    }
};