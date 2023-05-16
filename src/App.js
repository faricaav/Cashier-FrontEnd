import React, {useState} from 'react'
import './App.css';
import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom'
import Login from "./pages/login";
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Sidebar from './components/sidebar';
import Pegawai from './pages/pegawai';
import Menu from './pages/menu_admin';
import Meja from './pages/table_admin';
import Transaksi from './pages/transaksi';
import ChooseTable from './pages/choose_table';
import SidebarCashier from './components/sidebar_cashier';
import ChooseMenu from './pages/choose_menu';
import Cart from './pages/cart';
import "./components/print.css";
import TransaksiCashier from './pages/transaksi_cashier';
import SidebarManajer from './components/sidebar_manajer';
import TransaksiManajer from './pages/transaksi_manajer';

export const SidebarLayout = () => (
  <div className='flex no-printme'>
    <Sidebar />
    <Outlet />
  </div>
);

export const SidebarCashierLayout = () => (
  <div className='flex no-printme'>
    <SidebarCashier/>
    <Outlet />
  </div>
);

export const SidebarManajerLayout = () => (
  <div className='flex no-printme'>
    <SidebarManajer/>
    <Outlet />
  </div>
);

function App() {
  let [role, setRole]=useState(""); 
  role = localStorage.getItem('role')

  if (localStorage.getItem('token') === null && window.location.pathname !== '/') {
      localStorage.removeItem("nama_user")
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      localStorage.removeItem("id_user")
      window.location='/';
  }
  if((role !== "admin") &&
    (window.location.pathname === '/pegawai' || 
    window.location.pathname === '/table' || 
    window.location.pathname === '/menu' || 
    window.location.pathname === '/transaction')){
    localStorage.removeItem("nama_user")
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      localStorage.removeItem("id_user")
      window.location='/';
  }
  if((role !== "kasir") &&
    (window.location.pathname === '/chooseTable' || 
    window.location.pathname === '/chooseMenu' || 
    window.location.pathname === '/cart' || 
    window.location.pathname === '/transaction_cashier')){
    localStorage.removeItem("nama_user")
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      localStorage.removeItem("id_user")
      window.location='/';
  }
  if((role !== "manajer") &&
    window.location.pathname === '/transaction_manajer' ){
    localStorage.removeItem("nama_user")
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      localStorage.removeItem("id_user")
      window.location='/';
  }

  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login/>}/>
            {role === "admin" && 
              <Route element={<SidebarLayout/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/pegawai" element={<Pegawai/>}/>
                <Route path='/menu' element={<Menu/>}/>
                <Route path='/table' element={<Meja/>}/>
                <Route path='/transaction' element={<Transaksi/>}/>
              </Route>
            }
            {role === "kasir" && 
              <Route element={<SidebarCashierLayout/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path='/chooseTable' element={<ChooseTable/>}/>
                <Route path='/chooseMenu' element={<ChooseMenu/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/transaction_cashier' element={<TransaksiCashier/>}/>
              </Route>
            }
            {role === "manajer" && 
              <Route element={<SidebarManajerLayout/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path='/transaction_manajer' element={<TransaksiManajer/>}/>
              </Route>
            }
        </Routes>
    </Router>
  );
}

export default App;
