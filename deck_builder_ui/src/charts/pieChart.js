import Chart from 'chart.js/auto'

export const PieChart = (deckBreakdown) => {


  new Chart(
    document.getElementById('deckBreakdown'),
    {
      type: 'pie',
      data: {
        labels: deckBreakdown.map(row => row.cardType),
        datasets: [
          {
            label: 'Breakdown by card type',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
};
