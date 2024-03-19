import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Multiselect from "multiselect-react-dropdown";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import "./index.css";
import { useAccount, useNetwork, useWaitForTransactionReceipt } from "wagmi";
import { SEPOLIABIS, sepoliaContractAddress } from "./sepoliaConstant";
import { GOERLIABI, goerliAddress } from "./goerliConstant";
import {
	readContract,
	writeContract,
	waitForTransaction,
	sendTransaction,
} from "@wagmi/core";
import { nftAbi, nftAddressPoly, nftAddressBsc } from "./nft_constants";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, goerli } from "viem/chains";
import { createWalletClient, http, publicActions } from "viem";
import { toast } from "react-toastify";
import LoadingModal from "components/messageModal/LoadingModal";
// import { cu } from "@fullcalendar/core/internal-common";
const data = [
	{
		type: "wallet",
	},
];

const WalletPayment = ({ walletPopUp, setWalletPopUp }) => {
	const { open, close } = useWeb3Modal();
	const { address, isConnected } = useAccount();
	const [amount, setAmount] = useState(null);
	const { chain } = useNetwork();
	const [currency, setCurrency] = useState("");
	const [loading, setLoading] = useState(false);

	const connectWallet = async () => {
		try {
			await open();
			if (isConnected) {
				console.log("connected");

				window.location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	};
	const disconnectWallet = async () => {
		try {
			await open();
			if (!isConnected) {
				console.log("connected");
				window.location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	};
	const submitHandler = (e) => {
		e.preventDefault();
	};
	const transferNFT = async (metadata) => {
		try {
			const account = privateKeyToAccount(
				"0x" + process.env.REACT_APP_PRIVATE_KEY
			);

			if (chain.id === 11155111) {
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
			} else if (chain.id === 5) {
				const client = createWalletClient({
					account,
					chain: goerli,
					transport: http(),
				}).extend(publicActions);
				console.log("Public Actions: ", publicActions);
				console.log("client Address", nftAddressBsc);
				const { request } = await client.simulateContract({
					address: nftAddressBsc,
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
			}
		} catch (error) {
			console.error("ERROR IN TRANSFER:", error);
			toast.error("Error in transfer", {
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

	const transferCrypto = async () => {
		setLoading(true);
		try {
			const recieverAddress = "0x8eb0223cac4ae268Aa79E2C586a2a68bfF5D20e4";
			// Check if the amount is valid
			if (!amount || isNaN(amount) || amount <= 0) {
				console.error("Invalid amount");
				return;
			}
			if (chain.id === 11155111) {
				if (currency === "usdt") {
					const { hash } = await writeContract({
						address: sepoliaContractAddress,
						abi: SEPOLIABIS,
						functionName: "transfer",
						args: [
							recieverAddress,
							parseInt(Number(amount) * Math.pow(10, 6).toString()),
						],
					});
					// await waitForTransaction({ hash });
					console.log("hash", hash);
					await transferNFT({});
				} else if (currency === "polygon") {
					const { hash } = await sendTransaction({
						to: recieverAddress,
						value: Number(amount) * 10 ** 18,
					});
					console.log("hash", hash);
					// await waitForTransaction({ data });
					await transferNFT({});
				}
			} else if (chain.id === 5) {
				// add await for transaction complete
				if (currency === "usdt") {
					const { hash } = await writeContract({
						address: goerliAddress,
						abi: SEPOLIABIS,
						functionName: "transfer",
						args: [
							recieverAddress,
							parseInt(Number(amount) * Math.pow(10, 6).toString()),
						],
					});
					console.log("hash", hash);
					// await waitForTransaction({ hash });

					await transferNFT({});
				} else if (currency === "bnb") {
					const { hash } = await sendTransaction({
						to: recieverAddress,
						value: Number(amount) * 10 ** 18,
					});
					// await waitForTransaction({ hash });
					console.log("hash", hash);
					await transferNFT({});
				}
			}
		} catch (error) {
			console.log(error);
			toast.error("Error in transfer", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="wallet_payment_container">
			{loading && <LoadingModal />}
			<div className="close_btn" onClick={() => setWalletPopUp(!walletPopUp)}>
				<i className="bi bi-x-circle bg-color"></i>
			</div>
			<div className="wallet_payment_box_container">
				<h2 className="title">Wallet</h2>
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
								type="text"
								className="form-control"
								id="forename"
								name="amount"
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
								Select crypto
							</label>
							<select
								className="form-control"
								name="gender"
								style={{ textTransform: "uppercase" }}
								value={currency}
								onChange={(e) => setCurrency(e.target.value)}
							>
								<option value="">Select crypto</option>
								{Number(chain?.id) === 11155111 && (
									<>
										<option value="usdt">USDT</option>
										<option value="polygon">polygon</option>
									</>
								)}
								{Number(chain?.id) === 5 && (
									<>
										<option value="usdt">usdt</option>
										<option value="bnb">BNB</option>
									</>
								)}
							</select>
						</div>
					</div>
					{isConnected && address ? (
						<>
							<button
								type="submit"
								className="submit-btn"
								// onClick={disconnectWallet}
								onClick={transferCrypto}
							>
								send crypto
								{/* {`${address.substring(0, 4)}...${address.slice(-4)}`} */}
							</button>
						</>
					) : (
						<>
							<button
								type="submit"
								className="submit-btn"
								onClick={connectWallet}
							>
								Connect Wallet
							</button>
						</>
					)}
				</form>
			</div>
		</div>
	);
};

export default WalletPayment;
