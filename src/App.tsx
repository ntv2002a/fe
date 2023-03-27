import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import { Room, RoomSet, User } from './type';
import { SigningStargateClient } from '@cosmjs/stargate';
import { io, Socket } from 'socket.io-client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { OfflineSigner } from '@cosmjs/proto-signing';
import _ from 'lodash';
import { Home } from './components/Pages/HomePage';
import { NavigationBar } from './components/Navigation/NavigationBar';
import { WaitingRoom } from './components/Pages/WaitingRoom';
import CreateRoom from './components/Pages/CreateRoom';
import JoinRoom from './components/Pages/JoinRoom';
import GameRoom from './components/Pages/GameRoom';

export type GlobalContent = {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  signingClient: SigningStargateClient | null,
  setSigningClient: React.Dispatch<React.SetStateAction<SigningStargateClient | null>>,
  token: string,
  setToken: React.Dispatch<React.SetStateAction<string>>,
  currentRoom: Room | null,
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>,
  roomSet: RoomSet | null,
  setRoomSet: React.Dispatch<React.SetStateAction<RoomSet | null>>,
  functionGlobal: any,
  setFunctionGlobal: React.Dispatch<any>
}

type GetterContextType = {
  roomSet: RoomSet | null,
  currentRoom: Room | null,
  signingClient: SigningStargateClient | null,
  userWithBalance: UserWithBalance | null
}

type SetterContextType = {
  setRoomSet: React.Dispatch<React.SetStateAction<RoomSet | null>>,
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>,
  setSigningClient: React.Dispatch<React.SetStateAction<SigningStargateClient | null>>,
  setUserWithBalance: React.Dispatch<React.SetStateAction<UserWithBalance | null>>
}

type UserWithBalance = {
  user: User,
  balance: number
}

type ContextType = {
  getter: GetterContextType,
  setter: SetterContextType
}

const socket: Socket = io('192.168.10.65:3001/');

export const GlobalContext = createContext<GlobalContent | null>(null);
export const ApplicationContext = React.createContext<ContextType | null>(null)
export const SocketContext = createContext<Socket>(socket);

declare global {
  interface Window extends KeplrWindow { }
}

function App() {

  const [user, setUser] = useState<User | null>(null);
  const [signingClient, setSigningClient] = useState<SigningStargateClient | null>(null);
  const [token, setToken] = useState<string>('');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomSet, setRoomSet] = useState<RoomSet | null>(null);
  const [userWithBalance, setUserWithBalance] = React.useState<UserWithBalance | null>(null)

  const contextValue: ContextType = {
    getter: {
      roomSet,
      currentRoom,
      signingClient,
      userWithBalance
    },
    setter: {
      setRoomSet,
      setCurrentRoom,
      setSigningClient,
      setUserWithBalance
    }
  }

  //USE EFFECT  
  //Yêu cầu kết nối ví, đăng nhập
  useEffect(() => {
    checkLastLoginUser();
  }, []);

  //Check Token

  //updateRoom()
  useEffect(() => {
    socket.on('update room', (room: Room) => {
      // console.log(room);
      setCurrentRoom(room);
    })
  }, [currentRoom])

  //update-storage User to localStorage : Last-Login-User
  useEffect(() => {
    if (user) {
      localStorage.removeItem('Last-Login-User');
      localStorage.setItem('Last-Login-User', JSON.stringify({ user }));
    }
  }, [user]);

  //alert join room status
  useEffect(() => {
    socket.on('success to join the room', () => {
            alert('Success to join this room.')
    })
    socket.on('fail to join the room due to max player', () => {
        alert('Fail to join the room due to max player.')
    })
    socket.on('fail to join the room due to signed somewhere', () => {
        alert('Fail to join the room due to signed somewhere.')
    })
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  //FUNCTION
  //Check đăng nhập và kết nối ví
  const checkLastLoginUser = async () => {
    let rawUser = localStorage.getItem('Last-Login-User');
    if (rawUser != null) {
      setUser(JSON.parse(rawUser));

      //Check kết nối ví
      const { keplr } = window;
      if (typeof keplr != 'undefined') {
        let rawAddress = (await keplr.getKey('euphoria-2')).bech32Address;

        if (rawAddress == user?.address) {
          //getSigningClient
          const offlineSigner: OfflineSigner = window.getOfflineSigner!('eunphoria-2');
          const rawSigningClient: SigningStargateClient = await SigningStargateClient.connectWithSigner('https://rpc.euphoria.aura.network', offlineSigner);
          setSigningClient(rawSigningClient);
        }
        else return;
      }
      else return;
    }
    else return;
  }

  //Get Token
  const handleGetToken = async () => {
    let username: string = '';
    let address: string = '';

    if (user) {
      username = user.username;
      address = user.address;
    }
    try {
      const response = await fetch("http://192.168.10.68:3001/sign-in", {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ username, address })
      })

      const data = await response.json();
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.log(error)
    };
  }

  //Fetch Token
  const handleFetchToken = async () => {
    try {
      const token: string | null = localStorage.getItem('token');
      if (token !== null) {
        const response = await fetch("http://192.168.10.68:3001/session-validate", {
          method: 'POST',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({ token })
        })
        const data = await response.json();
        if (!_.isEqual(data, {})) {
          console.log(data);
          if (data.user.address != user?.address) {
            setUser(null)
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  const [functionGlobal, setFunctionGlobal] = useState<any>({});

  return (
    <GlobalContext.Provider value={{ user, setUser, signingClient, setSigningClient, token, setToken, currentRoom, setCurrentRoom, roomSet, setRoomSet, functionGlobal, setFunctionGlobal }}>
      <BrowserRouter>
        <div className="App">
          <header><NavigationBar /></header>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/waitingroom" element={<WaitingRoom />} />
              <Route path='/createroom' element={<CreateRoom />} />
              <Route path='/joinroom' element={<JoinRoom />} />
              <Route path='/gameroom' element={<GameRoom />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </GlobalContext.Provider>
  )
}

export default App;
