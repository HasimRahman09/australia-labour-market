import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

function formatDate(dateStr) {
  const [y, m] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

export default function WagesPrices({ data }) {
  const wages = data.wages;
  const prices = data.prices;

  const wpiGrowth = wages.annual_growth?.value;
  const cpiAnnual = prices.annual?.value;
  const realGrowth = wpiGrowth != null && cpiAnnual != null
    ? (wpiGrowth - cpiAnnual).toFixed(1)
    : null;
  const realPositive = parseFloat(realGrowth) >= 0;

  // Build combined chart: WPI growth vs CPI over time
  // WPI is quarterly, CPI is monthly — align by matching dates
  const wpiMap = {};
  (wages.annual_growth_series || []).forEach((d) => {
    wpiMap[d.date] = d.value;
  });

  const cpiMap = {};
  (prices.annual_series || []).forEach((d) => {
    cpiMap[d.date] = d.value;
  });

  // Use all unique dates from both
  const allDates = [...new Set([
    ...Object.keys(wpiMap),
    ...Object.keys(cpiMap),
  ])].sort();

  // For WPI (quarterly), forward-fill to monthly
  let lastWpi = null;
  const lineData = allDates.map((date) => {
    if (wpiMap[date] != null) lastWpi = wpiMap[date];
    return {
      date,
      label: formatDate(date),
      WPI: lastWpi,
      CPI: cpiMap[date] ?? null,
    };
  });

  return (
    <section className="section">
      <h2>Wages vs. inflation</h2>
      <p className="section-desc">
        Are wages keeping up with the cost of living? Comparing Wage Price Index
        (WPI) annual growth with Consumer Price Index (CPI) annual inflation.
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Wage growth (WPI)</div>
          <div className="stat-value">
            {wpiGrowth ?? "—"}<span className="stat-unit">% p.a.</span>
          </div>
          <div className="stat-subtitle">
            {wages.annual_growth?.date ? formatDate(wages.annual_growth.date) : ""}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Inflation (CPI)</div>
          <div className="stat-value">
            {cpiAnnual ?? "—"}<span className="stat-unit">% p.a.</span>
          </div>
          <div className="stat-subtitle">
            {prices.annual?.date ? formatDate(prices.annual.date) : ""}
          </div>
        </div>

        <div className={`stat-card ${realPositive ? "good" : "danger"}`}>
          <div className="stat-label">Real wage growth</div>
          <div className="stat-value" style={{ color: realPositive ? "#16a34a" : "#dc2626" }}>
            {realGrowth != null ? `${parseFloat(realGrowth) > 0 ? "+" : ""}${realGrowth}` : "—"}
            <span className="stat-unit">% p.a.</span>
          </div>
          <div className="stat-subtitle">
            {realPositive ? "Wages beating inflation" : "Wages trailing inflation"}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">Wage growth vs inflation (% annual change)</div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={lineData} margin={{ left: 5, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickFormatter={(v, i) => i % 12 === 0 ? v : ""}
            />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => v != null ? `${v}%` : "—"} />
            <Legend />
            <ReferenceLine y={0} stroke="#d1d5db" />
            <Line type="monotone" dataKey="WPI" stroke="#2563eb" strokeWidth={2} dot={false} name="Wage growth (WPI)" connectNulls />
            <Line type="monotone" dataKey="CPI" stroke="#dc2626" strokeWidth={2} dot={false} name="Inflation (CPI)" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`callout ${realPositive ? "insight" : "warning"}`}>
        <strong>{realPositive ? "Positive sign:" : "Cost of living squeeze:"}</strong>{" "}
        {realPositive
          ? `Wages are growing at ${wpiGrowth}% while inflation is ${cpiAnnual}%, giving workers a real pay increase of ${realGrowth}%. However, this follows a period of significant real wage decline during the post-pandemic inflation surge.`
          : `Inflation (${cpiAnnual}%) is outpacing wage growth (${wpiGrowth}%), meaning the typical worker's purchasing power is shrinking by ${Math.abs(parseFloat(realGrowth))}% per year. Even employed Australians are going backwards in real terms.`
        }
      </div>
    </section>
  );
}
