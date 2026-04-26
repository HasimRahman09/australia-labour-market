import { useState, useMemo } from "react";
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
} from "recharts";
import SuburbMap from "./SuburbMap";

function rateColor(rate) {
  if (rate < 3) return "#16a34a";
  if (rate < 5) return "#d97706";
  if (rate < 8) return "#ea580c";
  return "#dc2626";
}

function Sparkline({ data, dates }) {
  if (!data || data.every((v) => v == null)) return <span className="stat-subtitle">No trend data</span>;
  const chartData = dates.map((d, i) => ({ date: d, value: data[i] }));
  return (
    <ResponsiveContainer width={120} height={32}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function SuburbView({ salmData }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rate_desc");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  const filtered = useMemo(() => {
    let list = salmData.suburbs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "rate_desc") return (b.unemployment_rate ?? 0) - (a.unemployment_rate ?? 0);
      if (sortBy === "rate_asc") return (a.unemployment_rate ?? 0) - (b.unemployment_rate ?? 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "lf_desc") return (b.labour_force ?? 0) - (a.labour_force ?? 0);
      return 0;
    });
    return list;
  }, [salmData.suburbs, search, sortBy]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // Distribution chart
  const distData = Object.entries(salmData.distribution).map(([label, count]) => ({
    label,
    count,
  }));

  const DIST_COLORS = ["#16a34a", "#65a30d", "#d97706", "#ea580c", "#dc2626", "#991b1b"];

  // Top/bottom bar charts
  const topData = salmData.highest_unemployment.map((s) => ({
    name: s.name.length > 25 ? s.name.slice(0, 23) + "..." : s.name,
    fullName: s.name,
    rate: s.unemployment_rate,
  }));

  const bottomData = salmData.lowest_unemployment.map((s) => ({
    name: s.name.length > 25 ? s.name.slice(0, 23) + "..." : s.name,
    fullName: s.name,
    rate: s.unemployment_rate,
  }));

  return (
    <section className="section">
      <h2>NSW suburbs — December 2025</h2>
      <p className="section-desc">
        Unemployment rate for {salmData.total_suburbs} Statistical Area 2 (SA2) regions
        across New South Wales, from the DEWR Small Area Labour Markets publication.
      </p>

      <div className="stat-grid">
        <div className="stat-card highlight">
          <div className="stat-label">Mean unemployment</div>
          <div className="stat-value">
            {salmData.summary.mean_rate}<span className="stat-unit">%</span>
          </div>
          <div className="stat-subtitle">Across {salmData.total_suburbs} suburbs</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Median</div>
          <div className="stat-value">
            {salmData.summary.median_rate}<span className="stat-unit">%</span>
          </div>
        </div>
        <div className="stat-card good">
          <div className="stat-label">Lowest</div>
          <div className="stat-value" style={{ color: "#16a34a" }}>
            {salmData.summary.min_rate}<span className="stat-unit">%</span>
          </div>
          <div className="stat-subtitle">{salmData.lowest_unemployment[0]?.name}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Highest</div>
          <div className="stat-value" style={{ color: "#dc2626" }}>
            {salmData.summary.max_rate}<span className="stat-unit">%</span>
          </div>
          <div className="stat-subtitle">{salmData.highest_unemployment[0]?.name}</div>
        </div>
      </div>

      <h3>Unemployment across NSW</h3>
      <SuburbMap salmData={salmData} />

      <h3>Distribution of unemployment rates</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={distData} margin={{ left: 10, right: 10 }}>
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v} suburbs`} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Suburbs">
              {distData.map((_, i) => (
                <Cell key={i} fill={DIST_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="chart-container">
          <div className="chart-title">10 highest unemployment</div>
          <ResponsiveContainer width="100%" height={topData.length * 36 + 20}>
            <BarChart data={topData} layout="vertical" margin={{ left: 160, right: 50 }}>
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v, _, p) => [`${v}%`, p.payload.fullName]} />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]} fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-title">10 lowest unemployment</div>
          <ResponsiveContainer width="100%" height={bottomData.length * 36 + 20}>
            <BarChart data={bottomData} layout="vertical" margin={{ left: 160, right: 50 }}>
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v, _, p) => [`${v}%`, p.payload.fullName]} />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]} fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="callout warning">
        <strong>The suburb divide:</strong> Unemployment in NSW ranges from{" "}
        {salmData.summary.min_rate}% ({salmData.lowest_unemployment[0]?.name}) to{" "}
        {salmData.summary.max_rate}% ({salmData.highest_unemployment[0]?.name}) — a{" "}
        {(salmData.summary.max_rate / salmData.summary.min_rate).toFixed(0)}x difference.
        The suburbs with highest unemployment are concentrated in Western Sydney and
        parts of the Illawarra, reflecting entrenched spatial inequality.
      </div>

      <h3>Search all {salmData.total_suburbs} suburbs</h3>

      <div className="suburb-controls">
        <input
          type="text"
          className="suburb-search"
          placeholder="Search suburb name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
        <select
          className="suburb-sort"
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
        >
          <option value="rate_desc">Highest unemployment first</option>
          <option value="rate_asc">Lowest unemployment first</option>
          <option value="name">Alphabetical</option>
          <option value="lf_desc">Largest labour force first</option>
        </select>
      </div>

      <div className="suburb-results">
        <div className="suburb-count">
          Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
          {filtered.length} suburbs
        </div>

        <table className="suburb-table">
          <thead>
            <tr>
              <th>Suburb (SA2)</th>
              <th>Unemployment rate</th>
              <th>Unemployed</th>
              <th>Labour force</th>
              <th>2-year trend</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr key={s.code}>
                <td className="suburb-name-cell">{s.name}</td>
                <td>
                  <span className="rate-badge" style={{ background: rateColor(s.unemployment_rate), color: "white" }}>
                    {s.unemployment_rate}%
                  </span>
                </td>
                <td>{s.unemployed_persons != null ? Math.round(s.unemployed_persons).toLocaleString() : "—"}</td>
                <td>{s.labour_force != null ? Math.round(s.labour_force).toLocaleString() : "—"}</td>
                <td>
                  <Sparkline data={s.rate_trend} dates={salmData.recent_dates} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>
    </section>
  );
}
