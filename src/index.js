import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import "react-phone-number-input/style.css";
// import "./fontawesome";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/authContext";
import { ReactQueryDevtools } from "react-query/devtools";
import MessageModal from "./components/messageModal/MessageModal";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const queryClient = new QueryClient();
const initialOptions = {
  // clientId: "AeTpIBhsDmqUhRA8mIOh_dhyk2oBDxf3mAyjjrYy6d2CGy8RnaW1yRSAGRVHdwj-tRkK0VUpOfUB-_7N",
  clientId: "AdsAUgNaIt60lVV7J6zmtDAlual5uOiiLhdACcJMuB337et6OLV4WSd7dew23ES8xTeSVwUUp4-z5nTB",

  currency: "USD",
  components: "buttons",
  intent: "capture",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PayPalScriptProvider deferLoading={true} options={initialOptions}>
      <MessageModal>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} />; */}
        </QueryClientProvider>
      </MessageModal>
    </PayPalScriptProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
