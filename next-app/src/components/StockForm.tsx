import React, { useState } from "react";
import { useAvailableStocks } from "../hooks/useAvailableStocks";

interface Props {
  onSubmit: (params: {
    stock_id: string;
    download_type: string;
    is_table: boolean;
    is_graph: boolean;
    order_by: string;
    collapse_by: string;
    start_date: string;
    end_date: string;
  }) => void;
}

// Generate date options
const generateDays = () => Array.from({ length: 31 }, (_, i) => i + 1);
const generateMonths = () => [
  { id: "01", value: "Jan" },
  { id: "02", value: "Feb" },
  { id: "03", value: "Mar" },
  { id: "04", value: "Apr" },
  { id: "05", value: "May" },
  { id: "06", value: "Jun" },
  { id: "07", value: "Jul" },
  { id: "08", value: "Aug" },
  { id: "09", value: "Sep" },
  { id: "10", value: "Oct" },
  { id: "11", value: "Nov" },
  { id: "12", value: "Dec" },
];
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 1980; i <= currentYear; i++) {
    years.push(i);
  }
  return years.reverse();
};

export const StockForm: React.FC<Props> = ({ onSubmit }) => {
  const { data } = useAvailableStocks();

  const [stockId, setStockId] = useState("AAPL");
  const [downloadType, setDownloadType] = useState("csv");
  const [isTable, setIsTable] = useState(false);
  const [isGraph, setIsGraph] = useState(false);
  const [orderBy, setOrderBy] = useState("asc");
  const [collapseBy, setCollapseBy] = useState("none");

  // Start date
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");

  // End date
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = `${startYear}-${startMonth}-${startDay}`;
    const endDate = `${endYear}-${endMonth}-${endDay}`;

    const params = {
      stock_id: stockId,
      download_type: downloadType,
      is_table: isTable,
      is_graph: isGraph,
      order_by: orderBy,
      collapse_by: collapseBy,
      start_date: startDate,
      end_date: endDate,
    };

    if (!isTable && !isGraph) {
      // Straight download request
      const uri = `/api/stocks?stock_id=${params.stock_id}&download_type=${params.download_type}&is_table=${params.is_table}&order_by=${params.order_by}&collapse_by=${params.collapse_by}&start_date=${startDate}&end_date=${endDate}`;
      window.location.href = uri;
    } else {
      // Ajax call with table/graph display
      onSubmit(params);
    }
  };

  const days = generateDays();
  const months = generateMonths();
  const years = generateYears();

  return (
    <form className="container form-container" onSubmit={handleSubmit}>
      <div className="field is-horizontal">
        <div className="columns">
          <div className="column is-4">
            <h1 className="is-size-3">Stock Quotes</h1>
            <label className="label">Available Stocks</label>
            <p className="control">
              <span className="select is-medium">
                <select
                  name="stock_id"
                  id="stock_id"
                  value={stockId}
                  onChange={(e) => setStockId(e.target.value)}
                >
                  {data?.available_stocks?.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </span>
            </p>
          </div>
          <div className="column is-8">
            <div className="field-container">
              <h2 className="is-size-3">Search Params</h2>
              <div className="field-body">
                <div className="field">
                  <label className="label">Order By</label>
                  <p className="control">
                    <span className="select is-medium">
                      <select
                        name="order_by"
                        id="order_by"
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </span>
                  </p>
                </div>
                <div className="field">
                  <label className="label">Collapse By</label>
                  <p className="control">
                    <span className="select is-medium">
                      <select
                        name="collapse_by"
                        id="collapse_by"
                        value={collapseBy}
                        onChange={(e) => setCollapseBy(e.target.value)}
                      >
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </span>
                  </p>
                </div>
              </div>
              <div className="field-body">
                <div className="field">
                  <label className="label">Start Date</label>
                  <div className="field-body start-date-select-group">
                    <span className="select">
                      <select
                        name="day_select"
                        value={startDay}
                        onChange={(e) => setStartDay(e.target.value)}
                      >
                        <option value="">Day</option>
                        {days.map((day) => (
                          <option key={day} value={day < 10 ? `0${day}` : day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span className="select">
                      <select
                        name="month_select"
                        value={startMonth}
                        onChange={(e) => setStartMonth(e.target.value)}
                      >
                        <option value="">Month</option>
                        {months.map((month) => (
                          <option key={month.id} value={month.id}>
                            {month.value}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span className="select">
                      <select
                        name="year_select"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label">End Date</label>
                  <div className="field-body end-date-select-group">
                    <span className="select">
                      <select
                        name="day_select"
                        value={endDay}
                        onChange={(e) => setEndDay(e.target.value)}
                      >
                        <option value="">Day</option>
                        {days.map((day) => (
                          <option key={day} value={day < 10 ? `0${day}` : day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span className="select">
                      <select
                        name="month_select"
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value)}
                      >
                        <option value="">Month</option>
                        {months.map((month) => (
                          <option key={month.id} value={month.id}>
                            {month.value}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span className="select">
                      <select
                        name="year_select"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="is-size-3">Options</h2>
              <div className="field-body">
                <div className="field">
                  <label className="label">Download as</label>
                  <p className="control">
                    <span className="select is-medium">
                      <select
                        name="download_type"
                        id="download_type"
                        value={downloadType}
                        onChange={(e) => setDownloadType(e.target.value)}
                      >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                      </select>
                    </span>
                  </p>
                </div>
              </div>
              <div className="is-divider" data-content="OR"></div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="is_table"
                        id="is_table"
                        checked={isTable}
                        onChange={(e) => setIsTable(e.target.checked)}
                      />{" "}
                      Display them as table
                    </label>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="is_graph"
                        id="is_graph"
                        checked={isGraph}
                        onChange={(e) => setIsGraph(e.target.checked)}
                      />{" "}
                      Display them as graph
                    </label>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="field">
        <button
          className="button is-large is-primary"
          type="submit"
          id="submit_button"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
