import { Coin, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, StdFee, assertIsDeliverTxSuccess, DeliverTxResponse } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import Modal from 'react-modal';
import React, { useContext, useRef } from 'react';
import "./styles.css";
import { GlobalContext } from '../../../../App';
import _ from 'lodash';

const SERVER_MNEMONIC: string | undefined = "razor umbrella worry section stem athlete hero modify dirt sign ride lawsuit";
const getServer = async (): Promise<OfflineDirectSigner | null> => {
    let serverWallet: OfflineDirectSigner | null = null;
    if (SERVER_MNEMONIC !== undefined) {
        serverWallet = await DirectSecp256k1HdWallet.fromMnemonic(SERVER_MNEMONIC, {
            prefix: "aura",
        });
    }
    return serverWallet;
}

interface DepositProps {
    signingClient: SigningStargateClient | null,
    address: string | undefined,
}
export function Deposit({ signingClient, address, }: DepositProps) {

    const globalContext = useContext(GlobalContext);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    let depositToken = useRef('');

    const handleFetchGetDeposit = async () => {
        let data = null;
        let address = globalContext?.user?.address
        try {
          const response = await fetch("http://192.168.10.65:3001/get-verify-token", {
            method: 'POST',
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({ address })
          })
          data = await response.json();
        } catch (error) {
          console.log(error);
        }
        return data;
      }

    if (globalContext != null) {
        let tempAmountInput: string = '';
        let amountInput: string = '';

        const sendToken = async () => {
            const serverWallet = await getServer();
            let serverAddress = '';
            if (serverWallet != null) {
                serverAddress = (await serverWallet.getAccounts())[0].address;
            }

            const receiver: string = serverAddress;

            const amount: Coin[] = [{
                denom: 'ueaura',
                amount: amountInput,
            }]

            const fee: StdFee = {
                amount: [{
                    denom: 'ueaura',
                    amount: '200',
                },],
                gas: '200000',
            }
            if (signingClient != null && typeof address !== 'undefined') {
                const sendResult: DeliverTxResponse = await signingClient.sendTokens(address, receiver, amount, fee, depositToken.current);
                assertIsDeliverTxSuccess(sendResult);
                if (sendResult.code !== undefined &&
                    sendResult.code !== 0) {
                    alert("Failed to send tx: " + sendResult.rawLog);
                } else {
                    let txHash: string = sendResult.transactionHash;
                    let address = globalContext.user?.address;
                    let data = null;
                    try {
                        const response = await fetch("http://192.168.10.65:3001/deposit", {
                            // http://localhost:3001
                            method: 'POST',
                            headers: {
                                "Content-type": "application/json"
                            },
                            body: JSON.stringify({ txHash, address })
                        })
                        data = await response.json();
                        globalContext.setUser(JSON.parse(data))
                        alert("Succeed to send tx:" + sendResult.transactionHash);
                    } catch (error) {
                        console.log(error);
                    }
                    
                }
            }
        }

        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
            },
        };

        Modal.setAppElement('#root');
        const openModal = async () => {
            const result = await handleFetchGetDeposit();
            const rawToken = result.token;
            console.log(rawToken);
            if (rawToken) {
                depositToken.current = rawToken;
                setIsOpen(true);
            }
        };

        const closeModal = () => setIsOpen(false);

        return (
            <div className="Deposit">
                <button className='Dropdown-item' onClick={openModal}>Deposit</button>
                <Modal
                    isOpen={isOpen}
                    // nothing
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Deposit"
                >
                    <h1>Deposit</h1>
                    Amount(EAURA) :  <input type="text" onChange={(event: React.ChangeEvent<HTMLInputElement>) => tempAmountInput = event.target.value} /> <br />
                    <button onClick={
                        async () => {
                            const parsedTempAmountInput: number = parseFloat(tempAmountInput) * 1000000;
                            if (Number.isNaN(parsedTempAmountInput)) {
                                alert("Please input a float in Amount(EAURA) field.")
                            } else {
                                amountInput = parsedTempAmountInput.toString();
                                closeModal();
                                await sendToken();
                            }
                        }
                    }>Submit</button>
                    <button onClick={closeModal}>Close</button>
                </Modal>
            </div>
        );
    }
    else {
        return (
            <div>
                <h1>ERROR!</h1>
            </div>
        )
    }
}

// test Withdraw front-end
export function Withdraw() {
    const globalContext = useContext(GlobalContext);
    const [isOpen, setIsOpen] = React.useState(false);
    if (globalContext != null) {
        let tempAmountInput: string = '';
        let Amount: number = NaN;

        
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
            },
        };

        Modal.setAppElement('#root');
        const openModal = () => setIsOpen(true);
        const afterOpenModal = () => { };
        const closeModal = () => setIsOpen(false);
        return (<div className="Withdraw">
            <button className='Dropdown-item' onClick={openModal}>Withdraw</button>
            <Modal
                isOpen={isOpen}
                onAfterOpen={afterOpenModal}
                // nothing
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Withdraw"
            >
                <h1>Withdraw</h1>
                Amount(EAURA) :  <input type="text" onChange={(event: React.ChangeEvent<HTMLInputElement>) => tempAmountInput = event.target.value} /> <br />
                <button onClick={async () => {
                    const parsedTempAmountInput: number = parseFloat(tempAmountInput) * 1000000;

                    if (Number.isNaN(parsedTempAmountInput)) {
                        alert("Please input a float in Amount(EAURA) field.")
                    } else {
                        if (typeof globalContext.user?.asset != 'undefined' && parsedTempAmountInput >= globalContext.user?.asset) {
                            alert("Please input a valid Amount(EAURA) - Your asset don't have enough for Withdraw!")
                            closeModal();
                        }
                        Amount = parsedTempAmountInput;

                        let data = null;
                        let address = globalContext.user?.address;

                        try {
                            const response = await fetch("http://192.168.10.65:3001/withdraw", {
                                // http://localhost:3001
                                method: 'POST',
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({ address, Amount })
                            })
                            data = await response.json();
                            if (typeof JSON.parse(data) == 'string') {
                                alert("ERROR: " + JSON.parse(data))
                            }
                            else {
                                globalContext.setUser(JSON.parse(data))
                                alert("Withdraw Successfully!")
                            }
                            //code dieu kien check REST API ? Object user : ErrorMessage string
                        } catch (error) {
                            console.log(error);
                        }
                        closeModal();
                        // await getToken();
                    }
                }
                }>Submit</button>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>)
    }
    else {
        return (
            <div>
                <h1>
                    ERROR!
                </h1>
            </div>
        )
    }
}
