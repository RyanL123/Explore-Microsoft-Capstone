import * as React from 'react';
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@fluentui/react";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
