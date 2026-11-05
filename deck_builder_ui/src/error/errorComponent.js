import { lostImage } from "../helperFunctions"
import { SearchBar } from "../search/searchBar"

export function ErrorComponent() {
    return (
        <div>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px 24px' }}> 
                <SearchBar />
            </div>
            <div>
                <p>We can't seem to find what you're looking for. Please search again</p>
                <img 
                    src={lostImage}
                    alt="fblthp the lost" 
                />
            </div>
        </div>
    )
}