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

export default function TrendsChart({ data }) {
  const ts = data.time_series;

  // Unemployment rate trend (persons, males, females)
  const unempData = ts.unemployment_rate.map((d, i) => ({
    date: d.date,
    label: formatDate(d.date),
    Persons: d.value,
    Men: ts.unemployment_rate_males[i]?.value,
    Women: ts.unemployment_rate_females[i]?.value,
  }));

  // Participation rate trend
  const partData = ts.participation_rate.map((d, i) => ({
    date: d.date,
    label: formatDate(d.date),
    Persons: d.value,
    Men: ts.participation_rate_males[i]?.value,
    Women: ts.participation_rate_females[i]?.value,
  }));

  // Employment level
  const empData = ts.employed_total.map((d) => ({
    date: d.date,
    label: formatDate(d.date),
    value: Math.round(d.value),
  }));

  // Show every 12th tick label
  const tickFilter = (_, i) => i % 12 === 0;

  return (
    <section className="section">
      <h2>Historical trends</h2>
      <p className="section-desc">
        Monthly time series from 2015 to present, seasonally adjusted.
      </p>

      <div className="chart-container">
        <div className="chart-title">Unemployment rate (%)</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={unempData} margin={{ left: 5, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              tickFormatter={(v, i) => tickFilter(v, i) ? v : ""}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <ReferenceLine y={5} stroke="#d1d5db" strokeDasharray="5 5" label={{ value: "5%", position: "right", fontSize: 10 }} />
            <Line type="monotone" dataKey="Persons" stroke="#111827" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Men" stroke="#2563eb" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            <Line type="monotone" dataKey="Women" stroke="#dc2626" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">Participation rate (%)</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={partData} margin={{ left: 5, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              tickFormatter={(v, i) => tickFilter(v, i) ? v : ""}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Line type="monotone" dataKey="Persons" stroke="#111827" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Men" stroke="#2563eb" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            <Line type="monotone" dataKey="Women" stroke="#dc2626" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">Total employed (thousands)</div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={empData} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              tickFormatter={(v, i) => tickFilter(v, i) ? v : ""}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}M`}
            />
            <Tooltip formatter={(v) => `${(v / 1000).toFixed(2)}M`} />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} name="Employed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
