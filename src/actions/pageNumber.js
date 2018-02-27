
// Action for storing the current page number in the Redux store so when we click into a ticket 
// and then press the back button we can stay on the correct page within the table.

export const setPageNumber = (pageNumber) => ({
    type: "SET_PAGE_NUMBER",
        pageNumber
});