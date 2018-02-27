import React from "react";
import "./Pagination.css";

import PageNumber from "./PageNumber/PageNumber";

// Pagination component, loads in the PageNumber component, inline function calls for the next and previous buttons. 

const Pagination = (props) => {
    const numberOfPages = Math.ceil(props.items / props.itemsPerPage);
    const totalPageCount = Array.from(Array(numberOfPages).keys())
    const styles = "page-item page-item-primary";

    return (
        <div className="pagination">
            <button onClick={() => props.paginateTickets(1)} className={styles}>First</button>
            <button onClick={props.currentPage !== 1 ? () => props.paginateTickets(props.currentPage - 1) : null} className={styles}>{'<'}</button>
            {
                totalPageCount.map((p, i) => {
                    return <PageNumber
                        currentPage={props.currentPage}
                        paginateTickets={props.paginateTickets}
                        key={i + 1}
                        pageNumber={i + 1}
                    />
                })
            }
            <button onClick={props.currentPage !== numberOfPages ? () => props.paginateTickets(props.currentPage + 1) : null} className={styles}>{'>'}</button>
            <button onClick={() => props.paginateTickets(numberOfPages)} className={styles}>Last</button>
        </div>
    )
}

export default Pagination;




