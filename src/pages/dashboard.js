import { useState, useEffect } from "react"
import { IoIosArrowForward } from "react-icons/io"
import { Link } from "react-router-dom";
import Header from "../components/header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUtensils, faBurger, faSackDollar } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";

export default function DashboardAdmin(){
    let [token, setToken]=useState(localStorage.getItem("token"));
    let [nama_user, setNamaUser]=useState("");
    let [role, setRole]=useState(""); 
    const [user, setUser]=useState([]);
    const [meja, setMeja]=useState([]);
    const [menu, setMenu]=useState([]);
    const [transaksi, setTransaksi]=useState([]);
    const [userCount, setUserCount]=useState(0);
    const [menuCount, setMenuCount]=useState(0);
    const [mejaCount, setMejaCount]=useState(0);
    const [transaksiCount, setTransaksiCount]=useState(0);

    if (localStorage.getItem('token')) {
        // Token exists, retrieve user information
        role = localStorage.getItem('role');
        token = localStorage.getItem('token');
        nama_user = localStorage.getItem('nama_user');
    } 

    const headerConfig = () => {
        let header = {
        headers: { Authorization: `Bearer ${token}` },
        };
        return header;
    };

    const getPegawai = () => {
        axios
        .get("http://localhost:8080/user/", headerConfig())
        .then((response) => {
          const dataRes = response.data.user
          setUser(dataRes)
          setUserCount(dataRes.length)
        })
    }

    const getMeja = () => {
        axios
        .get("http://localhost:8080/meja/", headerConfig())
        .then((response) => {
          const dataRes = response.data.meja
          console.log(dataRes)
          setMeja(dataRes)
          setMejaCount(dataRes.length)
        })
    }

    const getMenu = () => {
        axios
        .get("http://localhost:8080/menu/", headerConfig())
        .then((response) => {
          const dataRes = response.data.menu
          console.log(dataRes)
          setMenu(dataRes)
          setMenuCount(dataRes.length)
        })
    }

    const getTransaksi = () => {
        axios
        .get("http://localhost:8080/transaksi/", headerConfig())
        .then((response) => {
          const dataRes = response.data
          console.log(dataRes)
          setTransaksi(dataRes)
          setTransaksiCount(dataRes.length)
        })
    }

    useEffect(() => {
        getPegawai()
        getMeja()
        getMenu()
        getTransaksi()
    }, []);

    return (
        <div className="flex-1">
        <Header/>
        <div className="flex-1 p-7 mt-4">
            <h1 className="text-2xl font-semibold " align="center">Hello, {nama_user} as {role}! <br/> Welcome Back to Website Wikusama Cafe</h1>
            <div className="row mt-4">
            <div className="col-sm-3">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-xl fw-bold text-blue"><FontAwesomeIcon icon={faUsers} className='mx-2'/> Total Users</h5>
                    <p className="mx-5 mt-n2">Our total users is</p>
                    <p className="card-text text-2xl fw-bold text-end ml-auto text-blue">{userCount}</p>
                </div>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-xl fw-bold text-blue"><FontAwesomeIcon icon={faUtensils} className='mx-2'/> Total Tables</h5>
                    <p className="mx-5 mt-n2">Our total tables is</p>
                    <p className="card-text text-2xl fw-bold text-end ml-auto text-blue">{mejaCount}</p>
                </div>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-xl fw-bold text-blue"><FontAwesomeIcon icon={faBurger} className='mx-2'/> Total Menus</h5>
                    <p className="mx-5 mt-n2"> Our total menus is</p>
                    <p className="card-text text-2xl fw-bold text-end ml-auto text-blue">{menuCount}</p>
                </div>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-xl fw-bold text-blue"><FontAwesomeIcon icon={faSackDollar} className='mx-2'/> Total Transactions</h5>
                    <p className="mx-5 mt-n2">Our total transactions is</p>
                    <p className="card-text text-2xl fw-bold text-end ml-auto text-blue">{transaksiCount}</p>
                </div>
                </div>
            </div>
            </div>
            <img className="mx-auto" src="https://img.freepik.com/free-vector/barista-carrying-takeaway-coffee-customer-outdoors_74855-10484.jpg?w=1380&t=st=1676881392~exp=1676881992~hmac=34b8d996a9d81f03b89e06fdea2fe1b11c862c5e65fd68837ace386907cb8e95" style={{width: "50%", height: "50%"}}/>
            <div align="center">
                {role === "admin" &&
                <Link to="/transaction"><button className="flex btn btn-primary btn-lg">Let's start <IoIosArrowForward className="mt-1"/></button></Link>
                }
                {role === "kasir" &&
                <Link to="/transaction_cashier"><button className="flex btn btn-primary btn-lg">Let's start <IoIosArrowForward className="mt-1"/></button></Link>
                }
                {role === "manajer" &&
                <Link to="/transaction_manajer"><button className="flex btn btn-primary btn-lg">Let's start <IoIosArrowForward className="mt-1"/></button></Link>
                }
            </div>
        </div>
        </div>
    )
}