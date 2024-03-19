// import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Layout from "./layout";
import Connect from "./pages/connect/Connect";
import CreatePassword from "./pages/createPassword/CreatePassword";
import CreatePost from "./pages/createPost/CreatePost";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Home from "./pages/home/Home";
import Inventory from "./pages/inventory/Inventory";
import Login from "./pages/login/Login";
import Notification from "./pages/notification/Notification";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import PostDetails from "./pages/postDetails/PostDetails";
import Privacy from "./pages/privacy/Privacy";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Search from "./pages/search/Search";
import Setting from "./pages/setting/Setting";
import Support from "./pages/support/Support";
import AcceptablePolicy from "./pages/Terms&Conditions/Acceptable-Policy";
import CookiePolicy from "./pages/Terms&Conditions/Cookie-Policy";
import PrivacyNotice from "./pages/Terms&Conditions/Privacy-Notice";
import TermsConditions from "./pages/Terms&Conditions/Terms-Conditions";
import Dashboard from "./pages/dashboard/Dashboard";
import "./styles/globalStyles.css";
import OTP from "pages/otp/Otp";
import PaymentWithWallet from "pages/paymentWithWallet";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { sepolia, mainnet } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();
const App = () => {
  const { auth } = useContext(AuthContext);
  const projectId = process.env.REACT_APP_PROJECT_ID;

  const metadata = {
    name: "socail locket",
    description: "social locket Example",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };
  const chains = [mainnet, sepolia];
  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
  });
  createWeb3Modal({ wagmiConfig, projectId, chains });
  const ProtectedRoute = ({ children }) => {
    if (!auth?.isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/support",
          element: <Support />,
        },
        {
          path: "/connect",
          element: <Connect />,
        },
        {
          path: "/settings?/:tab",
          element: (
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payemnt-with-wallet",
          element: (
            <ProtectedRoute>
              <PaymentWithWallet />
            </ProtectedRoute>
          ),
        },
        {
          path: "/notifications",
          element: <Notification />,
        },
        {
          path: "/profile/:username",
          element: <Profile />,
        },
        {
          path: "/privacy",
          element: <Privacy />,
        },
        {
          path: "/terms-conditions",
          element: <TermsConditions />,
        },
        {
          path: "/privacy-Notice",
          element: <PrivacyNotice />,
        },
        {
          path: "/cookie-Policy",
          element: <CookiePolicy />,
        },
        {
          path: "/acceptable-Policy",
          element: <AcceptablePolicy />,
        },
        {
          path: "/inventory",
          element: <Inventory />,
        },
        {
          path: "/create-post",
          element: <CreatePost />,
        },
        {
          path: "/update-post",
          element: <CreatePost />,
        },
        {
          path: "/post/:title",
          element: <PostDetails />,
        },
        {
          path: "/post-detail/:title/",
          element: <PostDetails />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/otp-verification/:user_id/:token",
      element: <OTP />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ForgotPassword />,
    },
    {
      path: "/create-password",
      element: <CreatePassword />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <ToastContainer />
    </WagmiConfig>
  );
};

export default App;
