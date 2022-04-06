import React from "react";
import { createRoot } from "react-dom/client";
import PopupPage from "./pages/PopupPage";
import "../static/main.css";

const Popup: React.FC = () => {
    return (
        <>
            <PopupPage />
        </>
    );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);