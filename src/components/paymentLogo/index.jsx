import React from "react";
import "./index.css";
import paymentLogo from "../../assets/svg/payment-icon.svg";
import card from "../../assets/images/cards.png"
import PaymentPopUp from "components/popUp";
const PaymentLogo = () => {
  const [popUpOpen, setPopUpOpen] = React.useState(false);

  return (
    <>
    <div
      className="payment_logo_container border-0"
      onClick={() => setPopUpOpen(!popUpOpen)}
    >
      <img src={card} alt="paymentlogo" />
    </div>
    {
        popUpOpen && <PaymentPopUp popUpOpen={popUpOpen} setPopUpOpen={setPopUpOpen}/>
    }
    </>

  );
};

export default PaymentLogo;
