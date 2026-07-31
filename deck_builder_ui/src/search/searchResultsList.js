import { SearchResultCard } from "./SearchResultCard";

export const SearchResultsList = ({
  searchResults,
  actionLabel,
  onAction,
}) => {
    return (
    <div className="results-grid">
        {searchResults.map((card) => (
            <SearchResultCard
                key={card.id}
                card={card}
                actionLabel={actionLabel}
                onAction={onAction}
            />
        ))}
    </div>
    );
};