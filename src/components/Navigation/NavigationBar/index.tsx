import React, { useContext } from "react";
import logo from '../../../Aura-logo-6.png';
import '../../../App.css';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Container, Dropdown, DropdownButton } from 'react-bootstrap';
import "./styles.css";
import { GlobalContext } from "../../../App";
import { WalletConnection } from "../../Wallet/Connection";
import { De_WI } from "../../Wallet/Transaction";

export const NavigationBar = () => {

    const globalContext = useContext(GlobalContext);

    if (globalContext != null) {

        // Show Info Function
        const showInfo = () => {
            globalContext.user != null
                &&
                alert("Username: " + globalContext.user.username + "\nAddress: " + globalContext.user.address + "\nAsset: " + globalContext.user.asset);
        }

        // Sign out Function
        const signOut = () => {
            globalContext.setUser(null);
            globalContext.setSigningClient(null);
        }

        return (
            <div className="App-navbar">
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="">
                            <img src={logo} className="App-logo" alt="logo" />
                        </Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="./">Home</Nav.Link>
                            <Nav.Link href="./waitingroom">Dashboard</Nav.Link>
                        </Nav>
                        <Nav>
                            {(!globalContext.signingClient)
                                ?
                                <WalletConnection setSigningClient={globalContext.setSigningClient} setUser={globalContext.setUser} />
                                :
                                <DropdownButton variant="outline-light" id="dropdown-basic-button" title={globalContext.user?.username}>
                                    <Dropdown.Item className="Dropdown-item" onClick={showInfo}>Info</Dropdown.Item>
                                    <Dropdown.Item className="Dropdown-item">
                                        <De_WI />
                                    </Dropdown.Item>
                                    <Dropdown.Item className="Dropdown-item" onClick={signOut}>Sign Out</Dropdown.Item>
                                </DropdownButton>}
                        </Nav>
                    </Container>
                </Navbar>
                <br />
            </div>
        )
    }

    return (
        <div>
            <h1>ERROR!</h1>
        </div>
    )
}