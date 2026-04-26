import {
  AreaChart,
  Area,
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

export default function EmploymentMix({ data }) {
  const ts = data.time_series;
  const h = data.headline;

  const ftTotal = h.employed_fulltime.value;
  const ptTotal = h.employed_parttime.value;
  const total = h.employed_total.value;
  const ftPct = ((ftTotal / total) * 100).toFixed(1);
  const ptPct = ((ptTotal / total) * 100).toFixed(1);

  // Stacked area: full-time vs part-time
  const areaData = ts.employed_fulltime.map((d, i) => ({
    date: d.date,
    label: formatDate(d.date),
    "Full-time": Math.round(d.value),
    "Part-time": Math.round(ts.employed_parttime[i]?.value || 0),
  }));

  // Gender split for full-time and part-time
  const ftMale = h.employed_fulltime_males.value;
  const ftFemale = h.employed_fulltime_females.value;
  const ptMale = h.employed_parttime_males.value;
  const ptFemale = h.employed_parttime_females.value;

  return (
    <section className="section">
      <h2>Employment composition</h2>
      <p className="section-desc">
        The split between full-time and part-time work, and how it differs by gender.
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Full-time employed</div>
          <div className="stat-value">
            {(ftTotal / 1000).toFixed(1)}<span className="stat-unit">M</span>
          </div>
          <div className="stat-subtitle">{ftPct}% of total</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Part-time employed</div>
          <div className="stat-value">
            {(ptTotal / 1000).toFixed(1)}<span className="stat-unit">M</span>
          </div>
          <div className="stat-subtitle">{ptPct}% of total</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">Full-time vs part-time employment (thousands)</div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaData} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              tickFormatter={(v, i) => i % 12 === 0 ? v : ""}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`}
            />
            <Tooltip formatter={(v) => `${(v / 1000).toFixed(2)}M`} />
            <Legend />
            <Area type="monotone" dataKey="Full-time" stackId="1" fill="#2563eb" stroke="#2563eb" fillOpacity={0.6} />
            <Area type="monotone" dataKey="Part-time" stackId="1" fill="#93c5fd" stroke="#93c5fd" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h3>Gender split</h3>
      <div className="gender-row">
        <div className="gender-card">
          <div className="gender-label">Full-time</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "0.5rem" }}>
            <div>
              <div className="stat-subtitle">Men</div>
              <div className="gender-value" style={{ color: "#2563eb", fontSize: "1.3rem" }}>
                {(ftMale / 1000).toFixed(1)}M
              </div>
              <div className="stat-subtitle">{((ftMale / (ftMale + ftFemale)) * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="stat-subtitle">Women</div>
              <div className="gender-value" style={{ color: "#dc2626", fontSize: "1.3rem" }}>
                {(ftFemale / 1000).toFixed(1)}M
              </div>
              <div className="stat-subtitle">{((ftFemale / (ftMale + ftFemale)) * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
        <div className="gender-card">
          <div className="gender-label">Part-time</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "0.5rem" }}>
            <div>
              <div className="stat-subtitle">Men</div>
              <div className="gender-value" style={{ color: "#2563eb", fontSize: "1.3rem" }}>
                {(ptMale / 1000).toFixed(1)}M
              </div>
              <div className="stat-subtitle">{((ptMale / (ptMale + ptFemale)) * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="stat-subtitle">Women</div>
              <div className="gender-value" style={{ color: "#dc2626", fontSize: "1.3rem" }}>
                {(ptFemale / 1000).toFixed(1)}M
              </div>
              <div className="stat-subtitle">{((ptFemale / (ptMale + ptFemale)) * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="callout insight">
        <strong>The part-time gap:</strong> Women make up{" "}
        {((ptFemale / (ptMale + ptFemale)) * 100).toFixed(0)}% of part-time workers
        but only {((ftFemale / (ftMale + ftFemale)) * 100).toFixed(0)}% of full-time
        workers. This has significant implications for lifetime earnings,
        superannuation balances, and the retirement savings gap.
      </div>
    </section>
  );
}
