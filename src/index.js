import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HeaderProvider } from "./contexts/HeaderContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserDataProvider } from "./contexts/UserDataContext";
// import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

// const container = document.getElementById("root");
// const root = createRoot(container);
// createRoot();

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <UserDataProvider>
                    <HeaderProvider>
                        <App />
                    </HeaderProvider>
                </UserDataProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
reportWebVitals();
