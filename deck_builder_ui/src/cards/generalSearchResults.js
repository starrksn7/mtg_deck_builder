import { useLocation, Link } from "react-router-dom"
import { Pagination } from "../search/pagination";
import { useState } from "react";
import { SearchBar } from "../search/searchBar";
import { useEffect } from "react";

export function GeneralSearchResults() {
    const location = useLocation();
    const resultsArray = location.state?.resultsArray ?? [];
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 20;
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const cardsDisplayed = resultsArray.slice(indexOfFirstCard, indexOfLastCard);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [location.key]);
    
    return (
        <div className="general-search-container">
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px 24px' }}> 
                <SearchBar />
            </div>
            {cardsDisplayed.length > 0 ? (
                <div className="general-search-grid">
                    {cardsDisplayed.map((result, index) => (
                        <div
                            className="general-search"
                            key={result.id ?? index}
                        >
                            <Link to={`/cards/${result.scryfall_id}`}>
                                <img
                                    src={result.image_uris}
                                    alt={result.name}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
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
    );
}