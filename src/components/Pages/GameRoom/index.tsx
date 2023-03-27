import React, { useContext } from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ApplicationContext, GlobalContext, SocketContext } from '../../../App';
import { Player } from '../../../type';
import { SideBar } from '../../Navigation/SideBar';
import { getNumberOfPlayers, getPlayerCurrentPositionInRoom } from '../../utils';
import { PlayerResult } from './Action/PlayerResult';
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

    //TeacherStarCi
    const [yourAddress, setYourAddress] = React.useState('');
    const [otherAddresses, setOtherAddresses] = React.useState<string[]>([]);
    const context = React.useContext(ApplicationContext);
    React.useEffect(() => {
        const assignOtherAddressess: string[] = [];
        if (context == null) return;
        if (context.getter.roomSet == null
            || context.getter.currentRoom == null
            || context.getter.userWithBalance == null) return;
        const numberOfPlayers = getNumberOfPlayers(context.getter.currentRoom.code, context.getter.roomSet);
        if (numberOfPlayers < 0) return;
        setYourAddress(context.getter.userWithBalance.user.address);
        if (numberOfPlayers < 2) return;
        const playerIndex = getPlayerCurrentPositionInRoom(context.getter.userWithBalance.user.address, context.getter.roomSet)
        for (let i = 0; i < numberOfPlayers; i++){
           if (i !== playerIndex){
            assignOtherAddressess.push(context.getter.currentRoom.players[i].socketUser.user.address)
           }
        }
        setOtherAddresses(assignOtherAddressess);
    }, [context])

    const displayOpponents = (otherAddresses: string[]): JSX.Element => {
        const results: JSX.Element[] = [];
        otherAddresses.forEach((address: string) => {
            results.push(<PlayerResult {...{ address: address }}>
                </PlayerResult>)
        })
        return (<div className = 'DisplayOpponents'> {results} </div>)
    }

    if (globalContext) {
        // return (
        //     <div className='App-dashboard'>
        //         <div>
        //             <ProSidebarProvider>
        //                 <SideBar />
        //             </ProSidebarProvider>
        //             <div>
        //                 <div className='div-0'>
        //                     <div className='div-1'>
        //                         <div className='div-player-1'>
        //                             User: {otherPlayer?.at(0)?.socketUser.user.username} <br />
        //                             {(typeof otherPlayer?.at(0)?.hand !== 'undefined') && otherPlayer.at(0)?.hand?.cards.toString()}
        //                         </div>
        //                     </div>
        //                     <div className='div-2'>
        //                         <div className='div-player-2'>
        //                             User: {otherPlayer?.at(1)?.socketUser.user.username} <br />
        //                             {(typeof otherPlayer?.at(1)?.hand !== 'undefined') && otherPlayer.at(1)?.hand?.cards.toString()}
        //                         </div>
        //                         <div className='div-player-3'>
        //                             User: {otherPlayer?.at(2)?.socketUser.user.username} <br />
        //                             {(typeof otherPlayer?.at(2)?.hand !== 'undefined') && otherPlayer.at(2)?.hand?.cards.toString()}
        //                         </div>
        //                     </div>
        //                     <div className='div-1'>
        //                         <div className='div-player-4'>
        //                             User: {mainPlayer?.socketUser.user.username} <br />
        //                             {/* In ra lá bài */}
        //                             {/* <img src={logo} className="cards" alt='backcard'></img>
        //                             <img src={logo} className="cards" alt='backcard'></img>
        //                             <img src={logo} className="cards" alt='backcard'></img> */}
        //                             {(typeof mainPlayer?.hand !== 'undefined') && (
        //                                 mainPlayer.hand.cards.map((x, index) => <img key={index} src={x.cardName + ' ' + x.suit + '.png'} className="cards" alt={x.cardName + ' ' + x.suit}></img>)
        //                             )}
        //                             <br />
        //                             <button onClick={() => startGame(globalContext.currentRoom?.code)}>Start Game</button>
        //                             <button onClick={() => terminateGame(globalContext.currentRoom?.code)}>Terminate</button>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // )
        return (
            <div className='GameRoom'>
                <h1> YOU </h1>
                <PlayerResult {...{ address: yourAddress }}>
                </PlayerResult>
                <h1> OPPONENT(S) </h1>
                {displayOpponents(otherAddresses)}
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