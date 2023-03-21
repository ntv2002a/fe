import { GlobalContext } from "../../../App";
import { useContext } from 'react'
import { Deposit, Withdraw } from "./Deposit-Withdraw";

export function De_WI() {
    const globalContext = useContext(GlobalContext);
    if (globalContext != null) {
        return (
            <div>
                <Deposit signingClient={globalContext.signingClient} address={globalContext.user?.address} />
                <Withdraw />
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