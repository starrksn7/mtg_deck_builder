import { useState } from "react";

export function FlipCard({card}) {
    const [isFlipped, setIsFlipped] = useState(false);

    <Link to={`/cards/${result.scryfall_id}`}>
        <img
            src={result.image_uris}
            alt={result.name}
        />
    </Link>
    return (
        <div className="card">
            {isFlipped ? (
                <Link to={`/cards/${card.scryfall_id}`}>
                    <img
                        src={card.backSideImage}
                        alt={card.backSideCardName}
                    />
                </Link>
            ) : (
                <Link to={`/cards/${card.scryfall_id}`}>
                    <img
                        src={card.image_uris}
                        alt={card.name}
                    />
                </Link>
            )}

            <button onClick={() => setIsFlipped(!isFlipped)}>
                <FiRefreshCw size={20} />
            </button>
        </div>
    );
}