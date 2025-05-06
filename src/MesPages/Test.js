import React, { useState, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import { generate } from "@ant-design/colors";

// Fonction de génération de données aléatoires
const genererDonneesSimulees = (annee) => {
    const produits = [];

    for (let i = 1; i <= 5; i++) {
        const mois = {
            jan: Math.floor(Math.random() * 5000) + 1000,
            feb: Math.floor(Math.random() * 4000) + 800,
            mar: Math.floor(Math.random() * 6000) + 1200,
            apr: Math.floor(Math.random() * 3000) + 500,
            may: Math.floor(Math.random() * 4500) + 900,
            jun: Math.floor(Math.random() * 5500) + 1100,
            jul: Math.floor(Math.random() * 3500) + 700,
            aug: Math.floor(Math.random() * 5000) + 1000,
            sep: Math.floor(Math.random() * 4200) + 850,
            oct: Math.floor(Math.random() * 4800) + 950,
            nov: Math.floor(Math.random() * 6000) + 1200,
            dec: Math.floor(Math.random() * 7000) + 1500,
        };

        produits.push({
            product_id: `PROD-${String(i).padStart(3, "0")}`,
            year: annee,
            ...mois,
            total: Object.values(mois).reduce((a, b) => a + b, 0),
        });
    }

    return produits.sort((a, b) => b.total - a.total); // Tri par total décroissant
};

// Configuration des mois
const MOIS = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
];
const NOMS_MOIS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];

const GraphiqueProduits = () => {
    const [annee, setAnnee] = useState(2023);
    const [donnees, setDonnees] = useState(null);

    // Simulation de chargement de données
    useEffect(() => {
        const chargerDonnees = () => {
            const dataSimulee = genererDonneesSimulees(annee);
            formaterDonnees(dataSimulee);
        };

        chargerDonnees();
    }, [annee]);

    const formaterDonnees = (data) => {
        const couleurs = generate("#1890ff", {
            theme: "dark",
            backgroundColor: "#141414",
        });

        const datasets = data.map((produit, index) => ({
            label: produit.product_id,
            data: MOIS.map((mois) => produit[mois]),
            borderColor: couleurs[index % couleurs.length],
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2,
        }));

        setDonnees({
            labels: NOMS_MOIS,
            datasets,
        });
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <h3 style={{ margin: 0 }}>Année :</h3>
                <select
                    value={annee}
                    onChange={(e) => setAnnee(Number(e.target.value))}
                    style={{ padding: "8px 12px", borderRadius: "4px" }}
                >
                    {[2020, 2021, 2022, 2023].map((an) => (
                        <option key={an} value={an}>
                            {an}
                        </option>
                    ))}
                </select>
            </div>

            {donnees && (
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <Chart
                        type="line"
                        data={donnees}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    grid: { display: false },
                                    title: {
                                        display: true,
                                        text: "Mois",
                                        color: "#666",
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: "Quantité",
                                        color: "#666",
                                    },
                                    beginAtZero: true,
                                },
                            },
                            plugins: {
                                legend: {
                                    position: "right",
                                    labels: {
                                        boxWidth: 20,
                                        usePointStyle: true,
                                    },
                                },
                                tooltip: {
                                    mode: "index",
                                    intersect: false,
                                },
                            },
                        }}
                        height={600}
                    />
                </div>
            )}
        </div>
    );
};

export default GraphiqueProduits;
