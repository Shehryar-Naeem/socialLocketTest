import React, { useContext, useEffect } from "react";
import "./index.css";
import payPal from "../../assets/images/paypal.png";
import wallet from "../../assets/svg/wallet.svg";
import bankCard from "../../assets/images/credit-card.png";
import WalletPayment from "components/WalletPayment";
import MasterCard from "components/masterCard";
import PayPal from "components/paypal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { AuthContext } from "context/authContext";
import { useNavigate } from "react-router-dom";

const stripe = loadStripe(
  "pk_test_51MFOETK7tBDZInmpfpMmh9jmUhnQP4LdSh5JoJtkR97ggoMUjgWAakUerjtkkzENrQ5v9GYmlXhfw7sto0iztagq001bHbR9Rs"
);
const PaymentPopUp = ({ popUpOpen, setPopUpOpen }) => {
  const [walletPopUp, setWalletPopUp] = React.useState(false);
  const [masterCardPopUp, setMasterCardPopUp] = React.useState(false);
  const [paypalPopUp, setPaypalPopUp] = React.useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "sk_test_51MFOETK7tBDZInmpXU5j3R1Cmwew2lHPjdRqnVJJOT7yp7EvYIXgmZOrB415PxvN162hLiqY95R3OzDRyjfnzwoz00YVfhjHRN",
  };

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      navigate("/login");
    }

    document.body.style.overflowY = "hidden";
    document.body.style.zIndex = 999;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.zIndex = 0;
    };
  });
  return (
    <>
      <div className="popup_container">
        <div className="close_btn" onClick={() => setPopUpOpen(!popUpOpen)}>
          <i class="bi bi-x-circle bg-color"></i>
        </div>
        <div className="box_container">
          <div className="bank_card_container">
            <h4>Crypto</h4>

            <div
              className="image_container"
              onClick={() => setWalletPopUp(!walletPopUp)}
            >
              <img src={wallet} alt="wallet" />
            </div>
          </div>
          <div className="bank_card_container">
            <h4>banker card</h4>
            <div
              className="image_container"
              onClick={() => setMasterCardPopUp(!masterCardPopUp)}
            >
              <img src={bankCard} alt="master_card" />
            </div>
          </div>
          <div className="bank_card_container">
            <h4>paypal</h4>
            <div
              className="image_container"
              onClick={() => setPaypalPopUp(!paypalPopUp)}
            >
              <img src={payPal} alt="paypal" />
            </div>
          </div>
        </div>
      </div>
      {walletPopUp && (
        <WalletPayment
          walletPopUp={walletPopUp}
          setWalletPopUp={setWalletPopUp}
        />
      )}
      {masterCardPopUp && (
        <Elements
          stripe={stripe}
          // options={options}
        >
          <MasterCard
            masterCardPopUp={masterCardPopUp}
            setMasterCardPopUp={setMasterCardPopUp}
          />
        </Elements>
      )}
      {paypalPopUp && (
        <PayPal paypalPopUp={paypalPopUp} setPaypalPopUp={setPaypalPopUp} />
      )}
    </>
  );
};

export default PaymentPopUp;
