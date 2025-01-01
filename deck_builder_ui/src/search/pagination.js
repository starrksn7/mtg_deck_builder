import React, { useState } from 'react';

export  const Pagination = ({ totalResults, paginate,  }) => {
    const pages = [];

    for(let i = 1; i <= Math.ceil(totalResults / 25); i++){
        pages.push(i);
    }

    return (
        <nav>
            <div className="pagination">
            {pages.map(number => (
                <div key={number} className="page-item">
                <button onClick={() => paginate(number)} className="page-link">
                    {number}
                </button>
                </div>
            ))}
            </div>
      </nav>
    )
}