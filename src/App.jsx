import data from "./data/labour_deep_dive.json";
import salmData from "./data/salm_nsw.json";
import HeadlineStats from "./components/HeadlineStats";
import TrendsChart from "./components/TrendsChart";
import StateBreakdown from "./components/StateBreakdown";
import EmploymentMix from "./components/EmploymentMix";
import Underemployment from "./components/Underemployment";
import WagesPrices from "./components/WagesPrices";
import SuburbView from "./components/SuburbView";
import "./App.css";

function formatReportDate(dateStr) {
  if (!dateStr) return "";
  const [y, m] = dateStr.split("-");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function App() {
  const reportDate = formatReportDate(data.report_date);

  return (
    <div className="app">
      <header className="site-header">
        <span className="report-date">Latest: {reportDate}</span>
        <h1>Australia Labour Market Deep Dive</h1>
        <p className="subtitle">
          A comprehensive look at the ABS Labour Force Survey — employment,
          unemployment, underemployment, states, and wages vs. inflation.
        </p>
      </header>

      <HeadlineStats data={data} />
      <TrendsChart data={data} />
      <StateBreakdown data={data} />
      <EmploymentMix data={data} />
      <Underemployment data={data} />
      <WagesPrices data={data} />
      <SuburbView salmData={salmData} />

      <footer className="site-footer">
        <p>
          Data sources: ABS Labour Force Survey (Cat. 6202.0), Wage Price Index
          (Cat. 6345.0), Consumer Price Index (Cat. 6401.0), DEWR Small Area
          Labour Markets (SALM) December quarter 2025. All figures seasonally
          adjusted unless noted.
        </p>
      </footer>
    </div>
  );
}
