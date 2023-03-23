import React, { useContext } from 'react';
import Modal from 'react-modal';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, SocketContext } from '../../../App';
import { SideBar } from '../../Navigation/SideBar';

export const CreateRoom = () => {

    const socket = useContext(SocketContext);
    const globalContext = useContext(GlobalContext);
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();

    const functionGameRoom = () => {
        navigate('/gameroom');
    }

    const createRoom = async (betAmount: number) => {
        if (globalContext) {
            let address: string | undefined;
            address = globalContext.user?.address;

            socket.emit('create new room request', betAmount, address);
            functionGameRoom();
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
    const openModal = () => setIsOpen(true);
    const afterOpenModal = () => { };
    const closeModal = () => setIsOpen(false);

    let tempAmountInput: string = '';
    let Amount: number = NaN;


    return (
        <div className='App-dashboard'>
            <div>
                <ProSidebarProvider>
                    <SideBar />
                </ProSidebarProvider>
                <div>
                    <button onClick={openModal}>Create Room</button>
                    <Modal
                        isOpen={isOpen}
                        onAfterOpen={afterOpenModal}
                        // nothing
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Create Room"
                    >
                        <h1>Create Room</h1>
                        Bet Amount: <input type="text" onChange={(event: React.ChangeEvent<HTMLInputElement>) => tempAmountInput = event.target.value} /> <br />
                        <button onClick={
                            async () => {
                                const parsedTempAmountInput: number = parseFloat(tempAmountInput);

                                if (Number.isNaN(parsedTempAmountInput)) {
                                    alert("Please input a float in Bet Amount field.")
                                } else {
                                    if (typeof globalContext?.user?.asset != 'undefined' && parsedTempAmountInput >= globalContext?.user?.asset) {
                                        alert("Please input a valid Bet Amount - Your asset don't have enough for Bet!")
                                        closeModal();
                                    }
                                    Amount = parsedTempAmountInput;

                                    createRoom(Amount);
                                    closeModal();
                                    // await getToken();
                                }
                            }
                        }>Submit</button>
                    </Modal>
                </div>
            </div>
        </div>
    )


}

export default CreateRoom