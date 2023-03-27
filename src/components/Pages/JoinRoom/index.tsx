import React, { useContext, useEffect, useRef } from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, SocketContext } from '../../../App';
import { Room, RoomSet } from '../../../type';
import { SideBar } from '../../Navigation/SideBar';

export const JoinRoom = () => {
    const socket = useContext(SocketContext);
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();

    const effectRef = useRef(true);
    useEffect(() => {
        if (effectRef.current) {
            socket.emit('show available room request');
            socket.on('update room set', (roomSet: RoomSet) => {
                globalContext?.setRoomSet(roomSet);
                console.log(roomSet);
            });
        }
        effectRef.current = false;
    }, [])

    const joinRoom = (roomId: string) => {
        if (globalContext != null) {
            let address: string | undefined;
            address = globalContext.user?.address;
            socket.emit('join an existed room request', roomId, address);

            navigate('/gameroom');
        }
    }

    //show table
    const showTable = (roomSet: RoomSet | null | undefined): JSX.Element => {
        if (roomSet == null || typeof roomSet == 'undefined') return (
            <table className="showTable">
            </table>
        )
        return (
            <table className="ShowTable">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Code</th>
                        <th>Bet Amount</th>
                        <th>Number Of Player</th>
                        <th>Join</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        roomSet.map((room: Room, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{room.code}</td>
                                    <td>{room.betAmount}</td>
                                    <td>{room.players.length}</td>
                                    <td> <button onClick={() => { joinRoom(room.code) }}> Join </button> </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }

    if (globalContext) {
        // return (
        //     <div className='App-dashboard'>
        //         <div>
        //             <ProSidebarProvider>
        //                 <SideBar />
        //             </ProSidebarProvider>
        //             <div>
        //                 {
        //                     (globalContext.roomSet?.map.length != 0) &&
        //                     <div>
        //                         <table style={{ border: '1px solid black' }}>
        //                             <thead>
        //                                 <tr>
        //                                     <th>ID</th>
        //                                     <th>Host</th>
        //                                     <th>Number of Player</th>
        //                                     <th>Bet Amount</th>
        //                                     <th>Action</th>
        //                                 </tr>
        //                             </thead>
        //                             <tbody>
        //                                 {
        //                                     globalContext.roomSet?.length !== 0 && globalContext.roomSet?.map((x, index) => <tr key={index}>
        //                                         <td>{x.code}</td>
        //                                         <td>{x.players.at(0)?.socketUser.user.username}</td>
        //                                         <td>{x.players.length % 4 + 1}/4   </td>
        //                                         <td>{x.betAmount}</td>
        //                                         <td>
        //                                             <button onClick={() => joinRoom(x.code)}>Join Room</button>
        //                                         </td>
        //                                     </tr>)
        //                                 }
        //                             </tbody>
        //                         </table>
        //                     </div>
        //                 }
        //             </div>
        //         </div>
        //     </div>
        // )
        return (
            <div className='Join'>
                {showTable(globalContext.roomSet)}
            </div>
        )
    }

    return (
        <div>
            <h1>ERROR!</h1>
        </div>
    )
}

export default JoinRoom;