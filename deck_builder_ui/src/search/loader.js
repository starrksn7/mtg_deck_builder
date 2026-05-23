import "../App.css";

export function Loader() {
  const symbols = ["w", "u", "b", "r", "g", "c"];

  return (
    <div className="mana-spinner">
      {symbols.map((symbol, index) => (
        <span
          key={symbol}
          className={`ms ms-${symbol} mana-symbol symbol-${index}`}
          // className={`<i class="ms ms-${symbol} ms-cost ms-shadow"></i>`}
        />
      ))}
    </div>
  );
}