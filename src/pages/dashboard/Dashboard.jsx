import React, { useMemo } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Chart } from "./Chart";
import useDashboard from "./useDashboard";
import LoadingSpinner from "../../components/messageModal/LoadingSpinner";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

//import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

function Dashboard() {
  const { isLoading, dashboardQuery } = useDashboard();
  console.log({ dashboardQuery });
  const list = dashboardQuery?.[0]?.data?.[0];
  const chartData = useMemo(() => {
    let temp = dashboardQuery?.[0]?.data?.[0];
    const data = {
      labels: Object.keys(temp ?? {}),
      datasets: [
        {
          data: Object.values(temp ?? {}),
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            //"rgba(54, 162, 235, 0.2)", blue = sold
            "rgba(255, 206, 86, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            //"rgba(54, 162, 235, 1)", blue = sold
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
    return data;
  }, [dashboardQuery?.[0]?.data?.[0]]);
  return (
    <div className="main-dashboard dashboard-adjustment h-100">
      <div className="box-shadow h-100">
        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <LoadingSpinner size={19} />
          </div>
        ) : (
          <Tabs>
            <TabList>
              <Tab>Bar Chart</Tab>
              <Tab>Doughnut Chart</Tab>
              <Tab>Line Chart</Tab>
            </TabList>
            <TabPanel>
              <div className="dashboard-status">
                <ul>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Real Time Metrics</h5>
                      <h6>Always stay up to date</h6>
                    </figcaption>
                  </li>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Data Is King</h5>
                      <h6>Track your progress</h6>
                    </figcaption>
                  </li>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Never Worry Again</h5>
                      <h6>A picture is a thousand words</h6>
                    </figcaption>
                  </li>
                </ul>
              </div>

              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="mb-4">Performance</h2>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="dashboard-news">
                            <ul>
                              <li>
                                <h4>Sold</h4>
                                <div className="dashboard-news-value">
                                  {list?.Sold ?? "00"}
                                </div>
                              </li>
                              <li>
                                <h4>Available</h4>
                                <div className="dashboard-news-value">
                                  {list?.Available ?? "00"}
                                </div>
                              </li>
                              {/* <li>
                                <h4>Purchased</h4>
                                <div className="dashboard-news-value">
                                  {list?.Purchased ?? "00"}
                                </div>
                              </li> */}
                              <li>
                                <h4>Under Offer</h4>
                                <div className="dashboard-news-value">
                                  {list?.Under_Offer ?? "00"}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="dashboard-shadow">
                            {/* <Bar 
                                      style = {
                                          {padding: '20px'}
                                      }
                                      data = {data}
                                      options = {options}
                                  ></Bar> */}

                            <Chart data={chartData} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="dashboard-status">
                <ul>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Real Time Metrics</h5>
                      <h6>Always stay up to date</h6>
                    </figcaption>
                  </li>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Data Is King</h5>
                      <h6>Track your progress</h6>
                    </figcaption>
                  </li>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Never Worry Again</h5>
                      <h6>A picture is a thousand words</h6>
                    </figcaption>
                  </li>
                </ul>
              </div>

              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="mb-4">Performance</h2>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                        <div className="dashboard-news">
                            <ul>
                              <li>
                                <h4>Sold</h4>
                                <div className="dashboard-news-value">
                                  {list?.Sold ?? "00"}
                                </div>
                              </li>
                              <li>
                                <h4>Available</h4>
                                <div className="dashboard-news-value">
                                  {list?.Available ?? "00"}
                                </div>
                              </li>
                              {/* <li>
                                <h4>Purchased</h4>
                                <div className="dashboard-news-value">
                                  {list?.Purchased ?? "00"}
                                </div>
                              </li> */}
                              <li>
                                <h4>Under Offer</h4>
                                <div className="dashboard-news-value">
                                  {list?.Under_Offer ?? "00"}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="dashboard-shadow">
                            {/* <Pie data={data} /> */}
                            <Chart type="doughnut" data={chartData} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="dashboard-status">
                <ul>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Real Time Metrics</h5>
                      <h6>Always stay up to date</h6>
                    </figcaption>
                  </li>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Data Is King</h5>
                      <h6>Track your progress</h6>
                    </figcaption>
                  </li>
                  <li>
                    <figure></figure>
                    <figcaption>
                      <h5>Never Worry Again</h5>
                      <h6>A picture is a thousand words</h6>
                    </figcaption>
                  </li>
                </ul>
              </div>

              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="mb-4">Performance</h2>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                        <div className="dashboard-news">
                            <ul>
                              <li>
                                <h4>Sold</h4>
                                <div className="dashboard-news-value">
                                  {list?.Sold ?? "00"}
                                </div>
                              </li>
                              <li>
                                <h4>Available</h4>
                                <div className="dashboard-news-value">
                                  {list?.Available ?? "00"}
                                </div>
                              </li>
                              {/* <li>
                                <h4>Purchased</h4>
                                <div className="dashboard-news-value">
                                  {list?.Purchased ?? "00"}
                                </div>
                              </li> */}
                              <li>
                                <h4>Under Offer</h4>
                                <div className="dashboard-news-value">
                                  {list?.Under_Offer ?? "00"}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="dashboard-shadow">
                            {/* <Bar 
                                      style = {
                                          {padding: '20px'}
                                      }
                                      data = {data}
                                      options = {options}
                                  ></Bar> */}
                            <Chart type="line" data={chartData} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
