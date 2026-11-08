import { getLostImage } from "../helperFunctions"
import { SearchBar } from "../search/searchBar"
import { useLocation } from "react-router-dom"

export function ErrorComponent() {
    const location = useLocation();
    const error = location.pathname === '/error'
    return (
        <div>
            {error && (
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px 24px' }}> 
                    <SearchBar />
                </div>
            )}
            <div>
                <p>We can't seem to find what you're looking for. Please search again</p>
                <img 
                    src={getLostImage()}
                    alt="fblthp the lost" 
                />
            </div>
        </div>
    )
}