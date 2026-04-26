export default function HeadlineStats({ data }) {
  const h = data.headline;
  const c = data.changes;

  function Change({ metric }) {
    const ch = c[metric];
    if (!ch) return null;
    const isRate = metric.includes("rate");
    // For unemployment: up is bad, down is good
    // For employed/participation: up is good, down is bad
    const upIsBad = metric === "unemployment_rate";
    const mom = ch.mom_change;
    const yoy = ch.yoy_change;
    const direction = mom > 0 ? "up" : mom < 0 ? "down" : "neutral";
    const className = upIsBad
      ? direction
      : direction === "up" ? "down" : direction === "down" ? "up" : "neutral";

    return (
      <div>
        <span className={`stat-change ${className}`}>
          {mom > 0 ? "+" : ""}{mom}{isRate ? "pp" : "K"} m/m
        </span>{" "}
        <span className={`stat-change ${upIsBad ? (yoy > 0 ? "up" : "down") : (yoy > 0 ? "down" : "up")}`}>
          {yoy > 0 ? "+" : ""}{yoy}{isRate ? "pp" : "K"} y/y
        </span>
      </div>
    );
  }

  return (
    <section className="section">
      <h2>Headline numbers</h2>
      <p className="section-desc">
        Key indicators from the latest monthly Labour Force Survey.
      </p>

      <div className="stat-grid">
        <div className="stat-card highlight">
          <div className="stat-label">Unemployment rate</div>
          <div className="stat-value">
            {h.unemployment_rate.value}<span className="stat-unit">%</span>
          </div>
          <Change metric="unemployment_rate" />
        </div>

        <div className="stat-card highlight">
          <div className="stat-label">Participation rate</div>
          <div className="stat-value">
            {h.participation_rate.value}<span className="stat-unit">%</span>
          </div>
          <Change metric="participation_rate" />
        </div>

        <div className="stat-card">
          <div className="stat-label">Employed</div>
          <div className="stat-value">
            {(h.employed_total.value / 1000).toFixed(1)}<span className="stat-unit">M</span>
          </div>
          <Change metric="employed_total" />
        </div>

        <div className="stat-card">
          <div className="stat-label">Unemployed</div>
          <div className="stat-value">
            {Math.round(h.unemployed_total.value)}<span className="stat-unit">K</span>
          </div>
          <div className="stat-subtitle">
            Labour force: {(h.labour_force.value / 1000).toFixed(1)}M
          </div>
        </div>
      </div>

      <h3>By gender</h3>
      <div className="gender-row">
        <div className="gender-card">
          <div className="gender-label">Men — unemployment</div>
          <div className="gender-value" style={{ color: "#2563eb" }}>
            {h.unemployment_rate_males.value}%
          </div>
          <div className="stat-subtitle">
            Participation: {h.participation_rate_males.value}%
          </div>
        </div>
        <div className="gender-card">
          <div className="gender-label">Women — unemployment</div>
          <div className="gender-value" style={{ color: "#dc2626" }}>
            {h.unemployment_rate_females.value}%
          </div>
          <div className="stat-subtitle">
            Participation: {h.participation_rate_females.value}%
          </div>
        </div>
      </div>

      <div className="callout insight">
        <strong>At a glance:</strong> Australia's unemployment rate stands at{" "}
        {h.unemployment_rate.value}%, with {(h.employed_total.value / 1000).toFixed(1)}M
        people employed. The participation rate of {h.participation_rate.value}% means
        roughly {(100 - h.participation_rate.value).toFixed(1)}% of working-age Australians
        are not in the labour force (studying, retired, caring, etc.).
        {h.unemployment_rate_males.value > h.unemployment_rate_females.value
          ? ` Men (${h.unemployment_rate_males.value}%) have higher unemployment than women (${h.unemployment_rate_females.value}%).`
          : ` Women (${h.unemployment_rate_females.value}%) have higher unemployment than men (${h.unemployment_rate_males.value}%).`}
      </div>
    </section>
  );
}
