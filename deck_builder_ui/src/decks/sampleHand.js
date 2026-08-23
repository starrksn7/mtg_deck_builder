export const SampleHand = ({ sampleHand }) => {
    return (
        <div className="sample-hand">
            {sampleHand.map((card, index) => (
                <div key={index}>
                    <img src={card} alt="sample hand card" />
                </div>
            ))}
        </div>
    );
};