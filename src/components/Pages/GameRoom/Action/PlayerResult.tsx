import React from "react"
import { ApplicationContext, SocketContext } from "../../../../App"
import { Card, Hand, HandState, Player } from "../../../../type";
import { getPlayerCurrentPositionInRoomSecondary } from "../../../utils";
import { DisplayCards } from "./DisplayCards";

interface PlayerResultProps {
    //true is your, false is not
    address: string|undefined|null
}
export const PlayerResult = (props: PlayerResultProps) => {
    const context = React.useContext(ApplicationContext);
    const socket = React.useContext(SocketContext);
    const [player, setPlayer] = React.useState<Player | null>(null);
    const [code, setCode] = React.useState('')
    const [cards, setCards] = React.useState<Card[]>([]);
    const [host, setHost] = React.useState(false)
    React.useEffect(() => {   
        if (context == null) return;
        if (context.getter.roomSet == null
            || context.getter.userWithBalance == null
            || context.getter.currentRoom == null
            || props.address == null
            || typeof props.address == 'undefined'
            || props.address === '') return;
        const playerIndex: number = getPlayerCurrentPositionInRoomSecondary(props.address, context.getter.currentRoom);
        setPlayer(context.getter.currentRoom.players[playerIndex]);
        setCode(context.getter.currentRoom.code);
        const hand: Hand | undefined = context.getter.currentRoom.players[playerIndex].hand
        console.log(hand)
        if (typeof hand != 'undefined') {
            setCards(hand.cards);
        }
        const address = context.getter.userWithBalance.user.address;
        if (props.address === address && playerIndex === 0) {
            setHost(true);
        }
    }, [context, props.address])

    const displayHandstate = (handState: HandState | undefined | null): JSX.Element => {
        if (typeof handState == 'undefined' || handState == null) return (<div className='DisplayHandState'></div>);
        switch (handState.state) {
            case 'Base':
                return (<div className='DisplayHandState'>
                    HandState - State: {handState.state}, Level: {handState.level}
                </div>)
            case 'Flush':
                return (<div className='DisplayHandState'>
                    HandState - State: {handState.state}, Begin: {handState.begin}
                </div>);
            case 'ThreeFaceCards':
                return (<div className='DisplayHandState'>
                    HandState - State: {handState.state}
                </div>);
            case 'ThreeOfAKind':
                return (<div className='DisplayHandState'>
                    HandState - State: {handState.state}, Value: {handState.value}
                </div>);
            default: return (<div className='DisplayHandState'></div>);
        }
    }

    const startGame = (code: string): void => {
        socket.emit('start game request', code);
    }

    const displayStartButton = (host: boolean): JSX.Element => {
        if (!host) return (<div className='DisplayStartButton'></div>);
        return (<div className='DisplayStartButton'>
            <button onClick={() => {startGame(code)}}> Start Game </button>
        </div>);
    }

    const displayWinner = (isWinner: boolean | undefined | null): JSX.Element => {
       if (isWinner == null || typeof isWinner == 'undefined'){
        return (<div className='DisplayWinner'> </div>);
       }
        if (isWinner){
        return (<div className='DisplayWinner'> You Win !</div>);
       } 
       return (<div className='DisplayWinner'> You Lose !</div>);
    }

    return (<div className='HandResult'>
        Address: {player?.socketUser.user.address} <br />
        Username: {player?.socketUser.user.username} <br />
        Asset: {player?.socketUser.user.asset} <br />
        <DisplayCards {...{ cards: cards }}> </DisplayCards>
        {displayHandstate(player?.hand?.result)}
        {displayWinner(player?.hand?.isWinner)}
        {displayStartButton(host)}
    </div>)

}