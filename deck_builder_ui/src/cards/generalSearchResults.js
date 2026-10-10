import { useLocation, Link } from "react-router-dom"
import { Pagination } from "../search/pagination";
import { useState } from "react";

export function GeneralSearchResults() {
    const location = useLocation();
    const resultsArray = location.state?.resultsArray ?? [];
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 20;
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const cardsDisplayed = resultsArray.slice(indexOfFirstCard, indexOfLastCard);
    const [isError, setIsError] = useState(false);
    
    return (
        <div>
             {cardsDisplayed.length > 0 ? (
                cardsDisplayed.map((result, index) => (
                    <div key={result.id ?? index}>
                        <Link to={`/card/${result.scryfall_id}`}>
                            <img src={result.image_uris} alt={result.name} />
                        </Link>
                    </div>
                ))
            ) : (
                <p>No results found.</p>
            )}
            <Pagination 
                cardsPerPage={cardsPerPage}
                totalResults={resultsArray.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isError={isError}
            />
        </div>
    )
}