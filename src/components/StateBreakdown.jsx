import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const STATE_COLORS = {
  NSW: "#2563eb",
  VIC: "#7c3aed",
  QLD: "#dc2626",
  SA: "#d97706",
  WA: "#16a34a",
  TAS: "#0891b2",
};

function formatDate(dateStr) {
  const [y, m] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

export default function StateBreakdown({ data }) {
  const unemp = data.states.unemployment;
  const part = data.states.participation;
  const series = data.states.unemployment_series;

  const stateOrder = ["NSW", "VIC", "QLD", "WA", "SA", "TAS"];

  const barData = stateOrder.map((s) => ({
    state: s,
    name: unemp[s].name,
    unemployment: unemp[s].value,
    participation: part[s].value,
  }));

  // Build combined time series for line chart
  const dates = series.NSW?.map((d) => d.date) || [];
  const lineData = dates.map((date, i) => {
    const point = { date, label: formatDate(date) };
    for (const s of stateOrder) {
      point[s] = series[s]?.[i]?.value;
    }
    return point;
  });

  const best = [...barData].sort((a, b) => a.unemployment - b.unemployment)[0];
  const worst = [...barData].sort((a, b) => b.unemployment - a.unemployment)[0];

  return (
    <section className="section">
      <h2>State & territory breakdown</h2>
      <p className="section-desc">
        Unemployment and participation rates by state (6 states with SA data).
      </p>

      <h3>Unemployment rate by state</h3>
      <div className="state-grid">
        {barData.map((s) => (
          <div key={s.state} className="state-card">
            <div className="state-name">{s.state}</div>
            <div className="state-value" style={{ color: STATE_COLORS[s.state] }}>
              {s.unemployment}%
            </div>
            <div className="stat-subtitle">{s.name}</div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <div className="chart-title">Unemployment rate comparison</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ left: 10, right: 10 }}>
            <XAxis dataKey="state" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="unemployment" radius={[4, 4, 0, 0]} name="Unemployment rate">
              {barData.map((d) => (
                <Cell key={d.state} fill={STATE_COLORS[d.state]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">Unemployment rate by state over time</div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={lineData} margin={{ left: 5, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickFormatter={(v, i) => i % 6 === 0 ? v : ""}
            />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            {stateOrder.map((s) => (
              <Line
                key={s}
                type="monotone"
                dataKey={s}
                stroke={STATE_COLORS[s]}
                strokeWidth={1.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>Participation rate by state</h3>
      <div className="state-grid">
        {barData.map((s) => (
          <div key={s.state} className="state-card">
            <div className="state-name">{s.state}</div>
            <div className="state-value" style={{ color: STATE_COLORS[s.state] }}>
              {s.participation}%
            </div>
          </div>
        ))}
      </div>

      <div className="callout insight">
        <strong>State comparison:</strong> {best.name} ({best.state}) has the
        lowest unemployment at {best.unemployment}%, while {worst.name} ({worst.state})
        has the highest at {worst.unemployment}%. The gap of{" "}
        {(worst.unemployment - best.unemployment).toFixed(1)}pp reflects
        differences in industry mix, population growth, and regional economic conditions.
      </div>
    </section>
  );
}
