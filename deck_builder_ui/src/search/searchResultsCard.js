import { replaceTextWithManaSymbols } from "../helperFunctions";

export const SearchResultCard = ({
  card,
  actionLabel,
  onAction,
}) => {
    return (
        <div className="result-row">
            <img src={card.fullArtLink} alt={card.name} />

            <div className="content">
            <div className="top">
                <div className="name">{card.name}</div>
                <div
                    className="mana"
                    dangerouslySetInnerHTML={{
                        __html: replaceTextWithManaSymbols(card.mana_cost),
                    }}
                />
                <div className="type">{card.type}</div>
            </div>
            <div
                className="oracle"
                dangerouslySetInnerHTML={{
                __html: replaceTextWithManaSymbols(card.oracle_text),
                }}
            />
            </div>

            <button
                className="action"
                onClick={() => onAction(card)}
                >
                {actionLabel}
            </button>
        </div>
    );
};