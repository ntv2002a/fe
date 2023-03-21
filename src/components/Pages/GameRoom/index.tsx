import React, { useContext } from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { GlobalContext, SocketContext } from '../../../App';
import { Player } from '../../../type';
import { SideBar } from '../../Navigation/SideBar';
import "./styles.css";

export const GameRoom = () => {
    const socket = useContext(SocketContext);
    const globalContext = useContext(GlobalContext);

    const startGame = (code: string | undefined) => {
        if (typeof code !== 'undefined')
            socket.emit('start game request', code);
    }

    const terminateGame = (code: string | undefined) => {
        socket.emit('terminate game request', code)
    }

    let mainPlayer: Player | undefined = globalContext?.currentRoom?.players.filter(players => players.socketUser.socketId === socket.id).at(0);

    let otherPlayer: Player[] | undefined = globalContext?.currentRoom?.players.filter(players => players.socketUser.socketId !== socket.id);

    if (globalContext) {
        return (
            <div className='App-dashboard'>
                <div>
                    <ProSidebarProvider>
                        <SideBar />
                    </ProSidebarProvider>
                    <div>
                        <div className='div-0'>
                            <div className='div-1'>
                                <div className='div-player-1'>
                                    User: {otherPlayer?.at(0)?.socketUser.user.username} <br/>
                                    {(typeof otherPlayer?.at(0)?.hand !== 'undefined') && otherPlayer.at(0)?.hand?.cards.toString()}
                                </div>
                            </div>
                            <div className='div-2'>
                                <div className='div-player-2'>
                                    User: {otherPlayer?.at(1)?.socketUser.user.username} <br/>
                                    {(typeof otherPlayer?.at(1)?.hand !== 'undefined') && otherPlayer.at(1)?.hand?.cards.toString()}
                                </div>
                                <div className='div-player-3'>
                                    User: {otherPlayer?.at(2)?.socketUser.user.username} <br/>
                                    {(typeof otherPlayer?.at(2)?.hand !== 'undefined') && otherPlayer.at(2)?.hand?.cards.toString()}
                                </div>
                            </div>
                            <div className='div-1'>
                                <div className='div-player-4'>
                                    User: {mainPlayer?.socketUser.user.username} <br />
                                    {(typeof mainPlayer?.hand !== 'undefined') && mainPlayer.hand.cards.toString()} <br/>
                                    <button onClick={() => startGame(globalContext.currentRoom?.code)}>Start Game</button>
                                    <button onClick={() => terminateGame(globalContext.currentRoom?.code)}>Terminate</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1>ERROR!</h1>
        </div>
    )
}

export default GameRoom;