import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  Sidebar
} from "react-pro-sidebar";
import logo from '../../../baitala.jpg';
import logo2 from '../../../Aura-logo-6.png';
import "./styles.css"

//import icons from react icons
import { FaList, FaRegHeart } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";

export const SideBar = () => {
  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(true)

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  return (
    <>
      <div id="header-sidebar">
        {/* collapsed props to change menu size using menucollapse state */}
        <Sidebar className='list' defaultCollapsed={menuCollapse}>
          <Sidebar>
            <div className="logotext">
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? <img style={{ width: "50px" }} src={logo2} alt="logo" /> : <img style={{ width: "120px" }} src={logo} alt="logo" />}</p>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? (
                <FiArrowRightCircle />
              ) : (
                <FiArrowLeftCircle />
              )}
            </div>
          </Sidebar>
          <Sidebar>
            <Menu>
              <MenuItem href="./" icon={<FiHome />}>Home</MenuItem>
              <MenuItem href="/dashboard" icon={<FaList />}>Dashboad</MenuItem>
              <MenuItem icon={<FaRegHeart />}>Favourite</MenuItem>
              <MenuItem icon={<RiPencilLine />}>Author</MenuItem>
              <MenuItem icon={<BiCog />}>Settings</MenuItem>
            </Menu>
          </Sidebar>
          <Sidebar className='bottom'>
            <Menu>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </Menu>
          </Sidebar>
        </Sidebar>
      </div>
    </>
  );
}