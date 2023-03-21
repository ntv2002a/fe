import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { SideBar } from '../../Navigation/SideBar';
import { GlobalContext, SocketContext } from '../../../App';
import { Room, RoomSet, User } from '../../../type';

export const WaitingRoom = () => {
    const navigate = useNavigate();

    const functionCreateRoom = () => {
        navigate('/createroom')
    }

    const fucntionJoinRoom = () => {
        navigate('/joinroom')
    }

    return (
        <div className='App-dashboard'>
            <div>
                <ProSidebarProvider>
                    <SideBar />
                </ProSidebarProvider>
                <div>
                    <button onClick={functionCreateRoom}>Create Room</button>
                    <button onClick={fucntionJoinRoom}>Join an existed room</button>
                </div>
            </div>
        </div>
    )
}
