import React from "react";
import "../Pagination.css";

// PageNumber component used to show the numbers on the Pagination component. 
// Renders numbers + 2  and - 2 of the current page as long as the number is above 0.

const PageNumber = (props) => {
    const styles = "page-item page-item-primary";
    return (
        <div className="pagination-btn-div">
            {
                (props.pageNumber <= (props.currentPage + 2) && props.pageNumber >= (props.currentPage - 2)) ? (
                    <button
                        onClick={() => props.paginateTickets(props.pageNumber)}
                        className={props.pageNumber === props.currentPage ? styles + " selected" : styles}
                    >{props.pageNumber}
                    </button>
                ) : (
                        null
                    )
            }
        </div>
    );
}

export default PageNumber;
