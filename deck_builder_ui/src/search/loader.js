import "../App.css";

export function Loader() {
  const symbols = ["w", "u", "b", "r", "g", "c"];

  return (
    <div className="loader-container">
      <div className="mana-spinner">
        {symbols.map((symbol, index) => {
          const angle = (360 / symbols.length) * index;

          return (
            <span
              key={symbol}
              className={`ms ms-${symbol} ms-cost ms-shadow mana-symbol`}
              style={{
                transform: `
                  rotate(${angle}deg)
                  translate(48px)
                  rotate(-${angle}deg)
                `,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}