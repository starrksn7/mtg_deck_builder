import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";

export function FlipCard({card}) {
    const [isFlipped, setIsFlipped] = useState(false);

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
            {card. backSideImage &&  (
                <button onClick={() => setIsFlipped(!isFlipped)}>
                    <FiRefreshCw size={20} />
                </button>
            )}
        </div>
    );
}