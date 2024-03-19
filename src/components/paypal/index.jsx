import React, { useState } from "react";
import "./index.css";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { nftAbi, nftAddressPoly, nftAddressBsc } from "./nft_constants";
import { readContract, writeContract } from "@wagmi/core";
import { useAccount, useNetwork } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, goerli } from "viem/chains";
import { createWalletClient, http, publicActions } from "viem";
import { toast } from "react-toastify";
const PayPal = ({ paypalPopUp, setPaypalPopUp }) => {
	const { address, isConnected } = useAccount();
	const { chain } = useNetwork();
	const [amount, setAmount] = useState("");
	const [{ isInitial, isPending, isResolved, isRejected, options }, dispatch] =
		usePayPalScriptReducer();
	const [currency, setCurrency] = useState(options.currency);

	let status = "no status";
	function onCurrencyChange({ target: { value } }) {
		setCurrency(value);
		dispatch({
			type: "resetOptions",
			value: {
				...options,
				currency: value,
			},
		});
	}
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

	if (isInitial) {
		status = "initial";
	} else if (isPending) {
		status = "pending";
	} else if (isResolved) {
		status = "resolved";
	} else if (isRejected) {
		status = "rejected";
	}
	const [show, setShow] = useState(false);
	const submitHandler = (e) => {
		e.preventDefault();
		setShow(!show);
		dispatch({
			type: "setLoadingStatus",
			value: "pending",
		});
	};
	const createOrder = (data, actions) => {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: {
							currency_code: currency,
							value: amount,
						},
					},
				],
			})
			.then((orderID) => {
				console.log(orderID);
				return orderID;
			});
	};
	const onApprove = (data, actions) => {
		console.log(data);
		console.log(actions);
		return actions.order.capture().then(async function (details) {
			console.log(details);

			await transferNFT("metadata");
			toast.success("Payment successful", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			setPaypalPopUp(!paypalPopUp);
		});
	};
	return (
		<div className="wallet_payment_container">
			<div className="close_btn" onClick={() => setPaypalPopUp(!paypalPopUp)}>
				<i className="bi bi-x-circle bg-color"></i>
			</div>
			<div className="wallet_payment_box_container">
				<h2 className="title">Paypal</h2>
				<form className="form_container" onSubmit={submitHandler}>
					<div className="amount">
						<div className="col-12">
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
								type="number"
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
              name="wallet_type"
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
								Select currency Type
							</label>
							<select
								className="form-control"
								name="currency"
								value={currency}
								onChange={onCurrencyChange}
							>
								<option value="">Select a currency</option>
								<option value="USD">United States dollar</option>
								<option value="EUR">Euro</option>
							</select>
						</div>
					</div>
					<button type="submit" className="submit-btn">
						{status}
					</button>

					{show && (
						<PayPalButtons
							style={{ layout: "vertical" }}
							createOrder={createOrder}
							onApprove={onApprove}
							onError={(error) => {
								// Handle payment error
								console.error("Error during payment:", error);
								toast.error("Error during payment", {
									position: "top-right",
									autoClose: 3000,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: true,
									progress: undefined,
								});
							}}
						/>
					)}
				</form>
			</div>
		</div>
	);
};

export default PayPal;
