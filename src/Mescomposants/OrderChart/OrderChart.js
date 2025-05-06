import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineController,
    BarController,
    defaults,
} from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { formatPrice, getMonthName } from "../../services/lib";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchStats } from "../../api/Stat";

function OrderChart() {
    const [year, setYear] = useState(2020);

    const handleChangeYear = (year) => {
        setYear((old) => year);
    };

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        PointElement,
        LineController,
        BarController
    );

    defaults.maintainAspectRatio = false;
    defaults.responsive = true;

    defaults.plugins.title.display = true;
    defaults.plugins.title.align = "start";
    defaults.plugins.title.font.size = 20;
    defaults.plugins.title.color = "black";
    let dates = [2020, 2021, 2022, 2023, 2024, 2025];

    const { data, isLoading } = useQuery({
        queryKey: ["stats", year],
        queryFn: () => fetchStats(year),
        placeholderData: keepPreviousData,
    });

    const dataChart = {
        labels: data?.map((stat) => {
            return getMonthName(stat.MONTH);
        }),
        datasets: [
            {
                type: "line",
                label: "Nombre de commandes",
                data: data?.map((stat) => {
                    return stat.NB_ORDER;
                }),
                backgroundColor: "#ededf0",
                borderColor: "#878a99",
                borderWidth: 2,
                yAxisID: "y1",
            },
            {
                type: "bar",
                label: "Revenues",
                data: data?.map((stat) => {
                    return stat.TOTAL_AMOUNT;
                }),
                backgroundColor: "#def1fb",
                borderColor: "#25a0e2",
                borderWidth: 2,
                fill: false,
                yAxisID: "y2",
                // tension: 0.1,
            },
        ],
    };

    return (
        <div className="col-xl-12">
            <div className="card">
                <div className="card-header border-0 align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">Revenues</h4>
                    <div className="flex-shrink-0 ms-2">
                        <div className="dropdown card-header-dropdown">
                            <button
                                className="btn btn-soft-primary btn-sm"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {year}
                                <i className="mdi mdi-chevron-down align-middle ms-1" />
                            </button>
                            <div className="dropdown-menu dropdown-menu-end">
                                {dates.map(
                                    (date, index) =>
                                        date !== year && (
                                            <button
                                                className="dropdown-item"
                                                onClick={() =>
                                                    handleChangeYear(date)
                                                }
                                                key={index}
                                            >
                                                {date}
                                            </button>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-header p-0 border-0 bg-light-subtle">
                    <div className="row g-0 text-center">
                        <div className="col-6 col-sm-6">
                            <div className="p-3 border border-dashed border-start-0">
                                <h5 className="mb-1 text-s">
                                    <span
                                        className="counter-value text-secondary"
                                        data-target={
                                            data &&
                                            data?.reduce(
                                                (acc, val) =>
                                                    acc + val.NB_ORDER,
                                                0
                                            )
                                        }
                                    >
                                        {data &&
                                            formatPrice(
                                                data?.reduce(
                                                    (acc, val) =>
                                                        acc + val.NB_ORDER,
                                                    0
                                                )
                                            )}
                                    </span>
                                </h5>
                                <p className="mb-0 text-white">Commandes</p>
                            </div>
                        </div>
                        {/*end col*/}
                        <div className="col-6 col-sm-6">
                            <div className="p-3 border border-dashed border-start-0">
                                <h5 className="mb-1 text-white ">
                                    {data &&
                                        data.length > 0 &&
                                        formatPrice(
                                            data?.reduce(
                                                (acc, val) =>
                                                    acc + val.TOTAL_AMOUNT,
                                                0
                                            )
                                        )}{" "}
                                    FCFA
                                </h5>
                                <p className="text-white mb-0">Revenues</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <Chart
                        type="bar"
                        data={dataChart}
                        options={{
                            responsive: true,
                            scales: {
                                y1: {
                                    type: "linear",
                                    display: true,
                                    position: "left",
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                                y2: {
                                    type: "linear",
                                    display: true,
                                    position: "right",
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            },
                            plugins: {
                                tooltip: {
                                    displayColors: false,
                                    callbacks: {
                                        label: function (context) {
                                            const index = context.dataIndex;
                                            const datasetIndex =
                                                context.datasetIndex;
                                            const datasets =
                                                context.chart.data.datasets;
                                            let label = "";
                                            if (datasetIndex === 0) {
                                                label += `Nombre de commandes: ${datasets[0].data[index]}\n`;
                                                label += `Revenu: ${formatPrice(
                                                    parseInt(
                                                        datasets[1].data[index]
                                                    )
                                                )} FCFA\n`;
                                            } else if (datasetIndex === 1) {
                                                label += `Revenu: ${formatPrice(
                                                    parseInt(
                                                        datasets[1].data[index]
                                                    )
                                                )} FCFA\n`;
                                                label += `Nombre de commandes: ${datasets[0].data[index]}`;
                                            }

                                            return label;
                                        },
                                    },
                                },
                            },
                        }}
                        style={{
                            height: 370,
                            fontFamily: "inherit",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default OrderChart;
