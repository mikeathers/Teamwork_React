import axios from "axios";

export const startSetUserAuth = () => {
    return (dispatch) => {
        var url = `http://localhost:51424/api/user/`;
        return axios({
            method: "GET",
            url: url
        }).then((res) => {
            const user = res.data;            
             // Passes the array of tickets to the setTickets action. 
            dispatch(setUserAuth(user));
        }).catch((e) => console.log(e));
    }
}

export const setUserAuth = (user) => ({
    type: "SET_USER_AUTH",
    user
});