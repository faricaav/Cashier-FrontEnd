import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri"
import { HiUserGroup } from "react-icons/hi2";
import { MdRestaurantMenu } from "react-icons/md";
import { SiAirtable } from "react-icons/si";
import { FaCashRegister } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {

    const [open, setOpen] = useState(true);
    const navigate = useNavigate()

    const out = () => {
        if (window.confirm("Are you sure to logout?")) {
         navigate('/')
         localStorage.removeItem("nama_user");
         localStorage.removeItem("token");
         localStorage.removeItem("role");
         localStorage.removeItem("id_user");
        }
    }

    return (
        <div className="flex ">
            <div
                className={` ${
                open ? "w-72" : "w-20 "
                } bg-blue min-h-screen p-5  pt-4 relative duration-300`}>
                    <FontAwesomeIcon icon={faBars} onClick={() => setOpen(!open)} className={`${!open && "mx-n5 mr-2"} cursor-pointer text-white top-18 absolute p-2 col-12 mx-12 mt-2`}/>
                <div className="flex gap-x-4 items-center">
                <img
                    src="https://www.freepnglogos.com/uploads/coffee-logo-png/coffee-logo-design-creative-idea-logo-elements-2.png"
                    style={{height: '50px', width: '50px'}}
                    className={`cursor-pointer duration-500 pt-2 ${
                    open && "rotate-[360deg]"
                    }`}
                />
                <h1
                    className={`text-white origin-left text-lg duration-200 pt-2 ${
                    !open && "scale-0"
                    }`}
                >
                    Wikusama Cafe
                </h1>
                </div>
                <ul className="pt-6">
                    <li className="flex  rounded-md p-2 cursor-pointer text-white text-sm items-center gap-x-4">
                        <div className={`${!open && "mx-n3 mt-2"} text-xl`} ><RiDashboardFill /></div>
                            <Link to="/dashboard" className="nav-link"><span className={`${!open && "hidden gap-x-4"} origin-left duration-200 text-white`}>
                                Dashboard
                            </span>
                            </Link>
                    </li>
                    <li className="flex  rounded-md p-2 cursor-pointer text-white text-sm items-center gap-x-4">
                        <div className={`${!open && "mx-n3 mt-3"} text-xl`} ><HiUserGroup/></div>
                            <Link to="/pegawai" className="nav-link"><span className={`${!open && "hidden gap-x-4"} origin-left duration-200 text-white`}>
                                Pegawai
                            </span>
                            </Link>
                    </li>
                    <li className="flex  rounded-md p-2 cursor-pointer text-white text-sm items-center gap-x-4">
                        <div className={`${!open && "mx-n3 mt-3"} text-xl`} ><MdRestaurantMenu /></div>
                            <Link to="/menu" className="nav-link"><span className={`${!open && "hidden gap-x-4"} origin-left duration-200 text-white`}>
                                Menu
                            </span>
                            </Link>
                    </li>
                    <li className="flex  rounded-md p-2 cursor-pointer text-white text-sm items-center gap-x-4">
                        <div className={`${!open && "mx-n3 mt-3"} text-xl`} ><SiAirtable /></div>
                            <Link to="/table" className="nav-link"><span className={`${!open && "hidden gap-x-4"} origin-left duration-200 text-white`}>
                                Table
                            </span>
                            </Link>
                    </li>
                    <li className="flex  rounded-md p-2 cursor-pointer text-white text-sm items-center gap-x-4">
                        <div className={`${!open && "mx-n3 mt-3"} text-xl`} ><FaCashRegister /></div>
                            <Link to="/transaction" className="nav-link"><span className={`${!open && "hidden gap-x-4"} origin-left duration-200 text-white`}>
                                Transaction
                            </span>
                            </Link>
                    </li>
                    <li className="flex  rounded-md p-2 cursor-pointer text-white text-sm items-center gap-x-4">
                        <div className={`${!open && "mx-n3 mt-3"} text-xl`} ><TbLogout /></div>
                            <a className="nav-link" onClick={()=>out()}><span className={`${!open && "hidden gap-x-4"} origin-left duration-200 text-white`}>
                                Logout
                            </span>
                            </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;