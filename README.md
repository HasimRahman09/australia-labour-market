# Australian labour market deep dive

An interactive look at the Australian labour market as of March 2026: what the headline
unemployment rate hides, how each state compares, whether wages are keeping up with prices, and
how unemployment varies across 623 NSW suburbs.

**Live:** [hasimrahman09.github.io/australia-labour-market](https://hasimrahman09.github.io/australia-labour-market/)

## What's in it

- **Headline numbers and trends.** Employment, unemployment and participation, with long-run series.
- **Underemployment.** People who have a job but want more hours. This is often a bigger group than the unemployed.
- **Employment mix.** Full-time against part-time, by sex.
- **States and territories.** Unemployment and participation side by side.
- **Wages against inflation.** Annual Wage Price Index growth against CPI, showing when real wages fell.
- **NSW suburbs.** A searchable map and table of small-area unemployment for December quarter 2025. Rates
  run from 0.3% to 20.1%.

## Data

- ABS Labour Force Survey (6202.0), seasonally adjusted
- ABS Wage Price Index (6345.0) and Consumer Price Index (6401.0)
- Department of Employment and Workplace Relations, Small Area Labour Markets (SALM), December quarter 2025
- ABS SA2 boundaries for the suburb map

The figures are pre-processed into JSON in `src/data/`. The app itself makes no API calls.

## Stack

React with Vite, Recharts for the charts, and Leaflet with TopoJSON for the map. A GitHub Actions
workflow builds the site and deploys it to GitHub Pages on every push to `main`.

## Run it

```bash
npm install
npm run dev
```
