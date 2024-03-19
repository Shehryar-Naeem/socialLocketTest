import React, { useState } from "react";
import "./index.css";
import {
  CardNumberElement,
  useStripe,
  useElements,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import Stripe from "stripe";
import { nftAbi, nftAddressPoly, nftAddressBsc } from "./nft_constants";
import { readContract, writeContract } from "@wagmi/core";
import { useAccount, useNetwork } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, goerli } from "viem/chains";
import { createWalletClient, http, publicActions } from "viem";
import { toast } from "react-toastify";

const MasterCard = ({ masterCardPopUp, setMasterCardPopUp }) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const stripInstance = Stripe(
    "sk_test_51MFOETK7tBDZInmpXU5j3R1Cmwew2lHPjdRqnVJJOT7yp7EvYIXgmZOrB415PxvN162hLiqY95R3OzDRyjfnzwoz00YVfhjHRN"
  );

  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const minimumAmountInPence = 300;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!amount) {
      setError("Amount is required");
      return;
    }

    if (!stripe || !elements) {
      return;
    }
    if (Number(amount) * 100 < minimumAmountInPence) {
      toast.error("Amount must be at least 300 pence", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setPaymentLoading(false); // Stop showing loading text
      return;
    }
    const cardNumberElement = elements.getElement(CardNumberElement);
    const expiryDateElement = elements.getElement(CardExpiryElement);
    const cvcElement = elements.getElement(CardCvcElement);
    if (!cardNumberElement || !expiryDateElement || !cvcElement) {
      setError("Card information is incomplete");
      return;
    }

    // if (
    //   !cardNumberElement.complete ||
    //   !expiryDateElement.complete ||
    //   !cvcElement.complete
    // ) {
    //   setError("Please fill in all card details");
    //   return;
    // }
    setPaymentLoading(true);
    try {
      const myPayment = await stripInstance.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
        metadata: {
          // company: "Ecommerce",
          company: "Social Locket",
        },
      });
      const transferNFT = async (metadata) => {
        try {
          const account = privateKeyToAccount(
            "0x" + process.env.REACT_APP_PRIVATE_KEY
          );

          const client = createWalletClient({
            account,
            chain: sepolia,
            transport: http(),
          }).extend(publicActions);
          const { request } = await client.simulateContract({
            address: nftAddressPoly,
            abi: nftAbi,
            functionName: "safeMint",
            args: [address, ""],
            account,
          });
          const hash = await client.writeContract(request);
          const l2Receipt = await client.waitForTransactionReceipt({
            hash: hash,
          });
          console.log(hash, l2Receipt);
        } catch (error) {
          console.error("ERROR IN TRANSFER:", error);
          toast.error("Error in nft transfer", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      };
      // 	try{
      //     if (chain?.id === 11155111) {
      //       const client = createWalletClient({
      //         account,
      //         chain: sepolia,
      //         transport: http(),
      //       }).extend(publicActions);
      //       const { request } = await client.simulateContract({
      //         address: nftAddressPoly,
      //         abi: nftAbi,
      //         functionName: "safeMint",
      //         args: [address, ""],
      //         value: 100000,
      //         account,
      //       });
      //       const hash = await client.writeContract(request);
      //       const l2Receipt = await client.waitForTransactionReceipt({
      //         hash: hash,
      //       });
      //       console.log(hash, l2Receipt);
      //     } else if (chain?.id === 5) {
      //       const client = createWalletClient({
      //         account,
      //         chain: goerli,
      //         transport: http(),
      //       }).extend(publicActions);
      //       const { request } = await client.simulateContract({
      //         address: nftAddressBsc,
      //         abi: nftAbi,
      //         functionName: "safeMint",
      //         args: [address, ""],
      //         value: 100000,
      //         account,
      //       });
      //       const hash = await client.writeContract(request);
      //       const l2Receipt = await client.waitForTransactionReceipt({
      //         hash: hash,
      //       });
      //       console.log(hash, l2Receipt);
      //     }
      //   } catch (error) {
      //     console.log(error);
      //     alert(error.message);
      //     toast.error(error.message, {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "light",
      //     });
      //   }

      const clientSecret = myPayment.client_secret;
      // const clientSecret = getClientSecret();

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: "Faruq Yusuff",
          },
        },
      });
      console.log(paymentResult);
      setPaymentLoading(false);
      if (paymentResult.error) {
        console.error("Payment error:", paymentResult.error.message);

        toast.error(paymentResult.error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        console.log(paymentResult.error.message);
      } else if (
        paymentResult.paymentIntent &&
        paymentResult.paymentIntent.status === "succeeded"
      ) {
        console.log("Payment successful");
        toast.success("Payment successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setAmount("");
        await transferNFT("metadata");

        if (cardNumberElement && expiryDateElement && cvcElement) {
          cardNumberElement.clear();
          expiryDateElement.clear();
          cvcElement.clear();
        }
      } else {
        console.error("Unexpected payment result:", paymentResult);

        // Check if the response contains an error message
        if (paymentResult.error?.message) {
          toast.error(paymentResult.error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // If no error message is found, show a generic error
          toast.error("An unexpected error occurred during payment", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    } catch (error) {
      console.log("Stripe API error:", error.type);

      if (
        error.type === "validation_error" &&
        error.code === "amount_too_small"
      ) {
        toast.error("Amount must be at least 30 pence", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (error.type === "StripeInvalidRequestError") {
        toast.error("Invalid card details", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,

          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("An unexpected error occurred during payment", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setPaymentLoading(false); // Stop showing loading text
    }
  };
  return (
    <div className="master_card_container">
      <div
        className="close_btn"
        onClick={() => setMasterCardPopUp(!masterCardPopUp)}
      >
        <i className="bi bi-x-circle bg-color"></i>
      </div>
      <div className="master_card_box_container">
        <h2 className="title">Master Card</h2>
        <form className="form_container" onSubmit={submitHandler}>
          <div className="amount">
            <div className="col-12">
              {error && (
                <p className="text-danger" style={{ fontWeight: "bold" }}>
                  {error}
                </p>
              )}
              <label
                htmlFor="forename"
                className="form-label"
                style={{
                  textTransform: "capitalize",
                  textAlign: "left",
                  display: "block",
                  color: "#fff",
                }}
              >
                amount
              </label>
              <input
                type="text"
                className="form-control"
                id="forename"
                name="forename"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <div className="amount">
            {/* <div className="mb-2">
            <label htmlFor="search_input" className="form-label">
              Select User Types
            </label>
            <Controller
              control={data}
              name="wa	llet_type"
              render={({ field: { value, onChange } }) => (
                <Multiselect
                  options={data?.map((item) => item?.type) ?? []}
                  isObject={false}
                  showCheckbox
                  hidePlaceholder
                  closeOnSelect={false}
                  onSelect={onChange}
                  onRemove={onChange}
                  selectedValues={value}
                  placeholder="Select Wallet Type"
                  className="text"
                  singleSelect
                />
              )}
            />
          </div> */}
            <div className="col-12">
              <label
                htmlFor="gender"
                className="form-label"
                style={{
                  textTransform: "capitalize",
                  textAlign: "left",
                  display: "block",
                  color: "#fff",
                }}
              >
                card number
              </label>

              <CardNumberElement className="form-control" />
            </div>
            <div className="col-12">
              <label
                htmlFor="gender"
                className="form-label"
                style={{
                  textTransform: "capitalize",
                  textAlign: "left",
                  display: "block",
                  color: "#fff",
                }}
              >
                expiry date
              </label>
              <CardExpiryElement className="form-control" />
            </div>
            <div className="col-12">
              <label
                htmlFor="gender"
                className="form-label"
                style={{
                  textTransform: "capitalize",
                  textAlign: "left",
                  display: "block",
                  color: "#fff",
                }}
              >
                card number
              </label>
              <CardCvcElement className="form-control" />
            </div>
            {/* <div className="col-12">
              <label
                htmlFor="gender"
                className="form-label"
                style={{
                  textTransform: "capitalize",
                  textAlign: "left",
                  display: "block",
                  color: "#fff",
                }}
              >
                Select Wallet Type
              </label>
              <select className="form-control" name="gender">
                <option value="">Select Wallet Type</option>
                <option value="crypto">crypto</option>
              </select>
            </div> */}
          </div>
          <button type="submit" className="submit-btn">
            {isPaymentLoading ? "Loading..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MasterCard;
