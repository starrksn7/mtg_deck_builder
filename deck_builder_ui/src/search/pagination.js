import React, { useState } from 'react';

export  const Pagination = ({ cardsPerPage, totalResults, currentPage, setCurrentPage }) => {
    const pages = [];

    for(let i = 1; i <= Math.ceil(totalResults / cardsPerPage); i++){
        pages.push(i);
    }

    const paginate = (pageNumber, e) => {
        e.preventDefault();
        setCurrentPage(pageNumber)
    }

    return (
        <nav>
            <div className="pagination">
            {pages.map(number => (
                <div key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                <button onClick={(e) => paginate(number, e)} href="!#" className="page-link">
                    {number}
                </button>
                </div>
            ))}
            </div>
      </nav>
    )
}