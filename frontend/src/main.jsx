import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#241F2E",
              color: "#FAF7F1",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#4C8F6B", secondary: "#FAF7F1" } },
            error: { iconTheme: { primary: "#C2483C", secondary: "#FAF7F1" } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
