import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, initializeIcons } from "@fluentui/react";

initializeIcons(); // fluent ui icons
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
