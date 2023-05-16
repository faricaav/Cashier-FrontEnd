import { useEffect, useState } from "react";
import CardTable from "../components/card_table";
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import styled from 'styled-components'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from "../components/header_cashier";
import { faFilter, faPenToSquare, faTrash, faChevronRight, faChevronLeft, faPlus, faXmark, faCircleCheck, faBan } from "@fortawesome/free-solid-svg-icons"

export default function Cart() {
    const [cart, setCart]=useState([]); 
    const [total, setTotal]=useState(0);
    const [action, setAction]=useState("");
    const [search, setSearch]=useState("");
    const [error, setError]=useState("");
    let [token, setToken]=useState("");
    const navigate = useNavigate();

    token = localStorage.getItem("token")
    const headerConfig = () => {
        let header = {
        headers: { Authorization: `Bearer ${token}` },
        };
        return header;
    };

    const checkOut = () => {
        let tempCart = []
        if (localStorage.getItem("cartItem") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cartItem"))
        } else {
            navigate('/chooseMenu')
        }
        let data = {
            id_meja: localStorage.getItem("id_meja"),
            status: "belum_bayar",
            id_user: localStorage.getItem("id_user"),
            nama_pelanggan: localStorage.getItem("nama_pelanggan"),
            detail_transaksi: tempCart
        }
        let url = "http://localhost:8080/transaksi/"
        axios.post(url, data, headerConfig())
            .then(res => {

                // clear cart
                window.alert("Success Checkout")
                localStorage.removeItem("cartItem")
                localStorage.removeItem("id_meja")
                localStorage.removeItem("nama_pelanggan")
                localStorage.removeItem("nomor_meja")
                navigate("/transaction_cashier")
                
            })
            .catch(error => {
                window.alert("Failed Checkout")
                console.log(error)
            })
    }

    const Cancel = () => {
        localStorage.removeItem("id_meja");
        localStorage.removeItem("nomor_meja");
        localStorage.removeItem("nama_pelanggan");
        localStorage.removeItem("cartItem")
        navigate('/chooseTable');
    } 

    const editItem = (selectedItem) => {
        let tempCart=[]
        if(localStorage.getItem("cartItem")!==null){
            tempCart=JSON.parse(localStorage.getItem("cartItem"))
        }
        let index = tempCart.findIndex(item => item.id_menu===selectedItem.id_menu)
        let promptJumlah = Number(window.prompt(`Qty ${selectedItem.nama_menu} : `, selectedItem.qty))
        tempCart[index].qty = promptJumlah

        localStorage.setItem("cartItem", JSON.stringify(tempCart))
        initCart()
    }

    const initCart = () => {
        // memanggil data cart pada localStorage
        let tempCart = []
        if (localStorage.getItem("cartItem") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cartItem"))
        }
        console.log(tempCart)
        // kalkulasi total harga
        let totalHarga = 0;
        tempCart.map(item => {
            totalHarga += (item.harga*item.qty)
        })
        // memasukkan data cart, user, dan total harga pada state
        setCart(tempCart)
        setTotal(totalHarga)
    }

    useEffect(() => {
        initCart()
    }, []);

    const Drop = (item) => {
        // beri konfirmasi untuk menghapus data
        if (window.confirm("Do you want to delete this menu from your cart")) {
            // menghapus data
            let tempCart = cart
            // posisi index data yg akan dihapus
            let index = tempCart.indexOf(item)

            // hapus data
            tempCart.splice(index, 1)
            localStorage.setItem('cartItem', JSON.stringify(tempCart))
            setCart(tempCart)
            initCart()
        }
    }

    return(
        <div className="flex-1">
            <Header/>
            <div className="container mt-5">
            <div className="col-md-8 col-lg-12 order-md-last"><br></br><br></br>
                <h4 className="d-flex justify-content-between align-items-center mb-4">
                    <span className="display-6 fw-bold">Order</span>
                            <span className="badge bg-dark rounded-pill"></span>
                        </h4>
                        <div className="col-4">
                            <h6>
                                Nama Pelanggan &emsp;&nbsp;: <b>{localStorage.getItem("nama_pelanggan")}</b>
                            </h6>
                            <h6 className="mt-2">
                                Meja     &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: <b>{localStorage.getItem("nomor_meja")}</b>
                            </h6>
                            <br></br>
                        </div>
                        <ul className="list-group ">
                            {console.log(cart)}
                        { cart.map( (item, index) =>
                            (
                            <li className="list-group-item d-flex justify-content-between">
                                {item.nama_menu}<br></br>
                                {item.qty} x Rp {item.harga} 
                                <p className='ml-auto text-end mt-2 mr-2'>Rp { item.harga * item.qty }</p>
                                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                <button className='btn btn-primary' id="blue" onClick={() => editItem(item)}><FontAwesomeIcon icon={faPenToSquare}/></button>
                                <button className='btn btn-danger' id="blue" onClick={() => Drop(item)}><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                            </li>
                                ) ) }
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total</span>Rp {total}
                            </li>
                        </ul>
                    <br></br>
                <NavLink to='/chooseMenu' className="btn btn-transparent btn-lg w-100" type="submit"><FontAwesomeIcon icon={faPlus}/> Tambah Menu Baru</NavLink><br></br>
                <button className="btn btn-primary btn mt-5 mx-auto justify-content-center" align="center" id="blue" onClick={() => checkOut()}>Checkout</button>
                <button className="btn btn-danger btn mx-2" align="center" id="blue" onClick={() => Cancel()}>Cancel</button>
            </div>
            </div>
        </div>
    )
}