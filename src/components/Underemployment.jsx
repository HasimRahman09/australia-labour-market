import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

function formatDate(dateStr) {
  const [y, m] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

export default function Underemployment({ data }) {
  const ue = data.underemployment;
  const h = data.headline;
  const series = data.underemployment_series;

  const ueRate = ue.underemployment_rate?.value;
  const unempRate = h.unemployment_rate.value;
  const utilRate = ue.underutilisation_rate?.value;

  // Combined chart: unemployment rate + underemployment rate from time_series
  const unempSeries = data.time_series.unemployment_rate;
  const lineData = unempSeries.map((d, i) => {
    const ueSeries = series[i];
    return {
      date: d.date,
      label: formatDate(d.date),
      "Unemployment rate": d.value,
      "Underemployment rate": ueSeries?.value,
    };
  });

  return (
    <section className="section">
      <h2>Beyond unemployment: underemployment</h2>
      <p className="section-desc">
        The unemployment rate only counts people with zero work. Underemployment
        captures those working fewer hours than they want — a critical measure
        of labour market slack.
      </p>

      <div className="stat-grid">
        <div className="stat-card highlight">
          <div className="stat-label">Unemployment rate</div>
          <div className="stat-value">
            {unempRate}<span className="stat-unit">%</span>
          </div>
          <div className="stat-subtitle">No work at all</div>
        </div>

        <div className="stat-card warn">
          <div className="stat-label">Underemployment rate</div>
          <div className="stat-value">
            {ueRate ?? "—"}<span className="stat-unit">%</span>
          </div>
          <div className="stat-subtitle">Working, but want more hours</div>
        </div>

        {utilRate && (
          <div className="stat-card danger">
            <div className="stat-label">Underutilisation rate</div>
            <div className="stat-value">
              {utilRate}<span className="stat-unit">%</span>
            </div>
            <div className="stat-subtitle">Unemployed + underemployed</div>
          </div>
        )}
      </div>

      {ueRate && (
        <div className="gender-row">
          <div className="gender-card">
            <div className="gender-label">Underemployment — Men</div>
            <div className="gender-value" style={{ color: "#2563eb" }}>
              {ue.underemployment_rate_males?.value ?? "—"}%
            </div>
          </div>
          <div className="gender-card">
            <div className="gender-label">Underemployment — Women</div>
            <div className="gender-value" style={{ color: "#dc2626" }}>
              {ue.underemployment_rate_females?.value ?? "—"}%
            </div>
          </div>
        </div>
      )}

      <div className="chart-container">
        <div className="chart-title">Unemployment vs underemployment rate (%)</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData} margin={{ left: 5, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              tickFormatter={(v, i) => i % 12 === 0 ? v : ""}
            />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => v != null ? `${v}%` : "—"} />
            <Legend />
            <Line type="monotone" dataKey="Unemployment rate" stroke="#111827" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Underemployment rate" stroke="#d97706" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="callout warning">
        <strong>Why this matters:</strong> The headline unemployment rate of{" "}
        {unempRate}% understates true labour market slack. Add the{" "}
        {ueRate ?? "N/A"}% who are underemployed and{" "}
        {utilRate
          ? `the total underutilisation rate is ${utilRate}% — roughly 1 in ${Math.round(100 / utilRate)} working-age Australians either can't find work or can't get enough hours.`
          : "the picture of spare capacity is significantly larger."}
        {ue.underemployment_rate_females?.value > ue.underemployment_rate_males?.value
          ? ` Women are disproportionately affected (${ue.underemployment_rate_females.value}% vs ${ue.underemployment_rate_males.value}% for men), reflecting higher rates of involuntary part-time work.`
          : ""}
      </div>
    </section>
  );
}
