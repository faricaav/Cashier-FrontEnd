import { useEffect, useState } from "react";
import CardMenuCashier from "../components/card_menu_cashier";
import axios from 'axios';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import styled from 'styled-components'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from "../components/header_cashier";
import { useNavigate } from "react-router-dom";
import { faFilter, faPenToSquare, faTrash, faChevronRight, faChevronLeft, faPlus, faXmark, faBowlFood, faMugSaucer } from "@fortawesome/free-solid-svg-icons"

export default function ChooseMenu() {
    const [menu, setMenu]=useState([]); 
    const [id_menu, setIdMenu]=useState(0);
    const [nama_menu, setNamaMenu]=useState("");
    const [jenis, setJenis]=useState("");
    const [deskripsi, setDeskripsi]=useState("");
    const [gambar, setGambar]=useState(null);
    const [harga, setHarga]=useState(0);
    const [isModalOpen, setIsModalOpen]=useState(false);
    const [action, setAction]=useState("");
    const [search, setSearch]=useState("");
    const [currentPage, setCurrentPage]=useState(0);
    const [menuFav, setMenuFav]=useState("");
    const [error, setError]=useState("");
    const PER_PAGE = 12;
    let [token, setToken]=useState("");
    const [cart, setCart]=useState([]); 
    const navigate = useNavigate();

    token = localStorage.getItem("token")
    const headerConfig = () => {
        let header = {
        headers: { Authorization: `Bearer ${token}` },
        };
        return header;
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setCurrentPage(selectedPage);
    };

    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(menu.length / PER_PAGE);
    const menuPerPage = menu.slice(offset, offset + PER_PAGE); 
    const menuNumber = menuPerPage.length
    
    const MyPaginate = styled(ReactPaginate).attrs({
    // You can redifine classes here, if you want.
    activeClassName: 'active', // default to "disabled"
    })`
        margin-bottom: 2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        list-style-type: none;
        padding: 0 5rem;
        li a {
          border-radius: 7px;
          padding: 0.1rem 1rem;
          border: gray 1px solid;
          cursor: pointer;
        }
        li.previous a,
        li.next a,
        li.break a {
          border-color: transparent;
        }
        li.active a {
          background-color: #0366d6;
          border-color: transparent;
          color: white;
          min-width: 32px;
        }
        li.disabled a {
          color: grey;
        }
        li.disable,
        li.disabled a {
          cursor: default;
        }
    `;

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token')
    } else {
        window.location="/"
    }
  
    useEffect(() => {
        getMenu()
        getMenuFav()
    }, [setCurrentPage]);

    const getMenu = () => {
        axios
        .get("http://localhost:8080/menu/", headerConfig())
        .then((response) => {
          const dataRes = response.data.menu
          console.log(dataRes)
          setMenu(dataRes)
        })
    }

    const getMakanan = () => {
        axios
        .get("http://localhost:8080/filter/makanan", headerConfig())
        .then((response) => {
          const dataRes = response.data.menu
          console.log(dataRes)
          setMenu(dataRes)
        })
    }

    const getMinuman = () => {
        axios
        .get("http://localhost:8080/filter/minuman", headerConfig())
        .then((response) => {
          const dataRes = response.data.menu
          console.log(dataRes)
          setMenu(dataRes)
        })
    }

    const getMenuFav = () => {
      axios
      .get("http://localhost:8080/filter/most", headerConfig())
      .then((response) => {
        const dataRes = response.data.menu
        console.log(dataRes)
        setMenuFav(dataRes)
      })
    }

    const handleChoose = (selectedItem) => {
        if (localStorage.getItem("id_meja") !== null) {
          let tempCart = []
    
          if (localStorage.getItem("cartItem") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cartItem"))
            // JSON.parse() digunakan untuk mengonversi dari string -> array object
          }
    
          // cek data yang dipilih user ke keranjang belanja
          let existItem = tempCart.find(item => item.id_menu === selectedItem.id_menu)
          if (existItem) {
            // jika item yang dipilih ada pada keranjang belanja
            window.alert(`You already choose ${selectedItem.nama_menu}`)
          }
          else {
            // user diminta memasukkan jumlah item yang dibeli
            let promptJumlah = Number(window.prompt(`Qty ${selectedItem.nama_menu} : `, 0))
            if (promptJumlah !== null && promptJumlah !== 0  && promptJumlah>0) {
              // jika user memasukkan jumlah item yang dibeli
              // menambahkan properti "jumlahBeli" pada item yang dipilih
              selectedItem.qty = promptJumlah
            //   selectedItem.subtotal = promptJumlah * selectedItem.harga
              // masukkan item yang dipilih ke dalam cart
              tempCart.push(selectedItem)
              // simpan array tempCart ke localStorage
              localStorage.setItem("cartItem", JSON.stringify(tempCart))
            } else {
              window.alert("Can not add qty")
            }
          }
        } else {
          navigate('/chooseTable')
        }
    }

  return (
    <div className="flex-1">
        <Header/>
            <div className='card-header border-0 pt-6 mx-5'>
                <div className='d-flex align-items-center position-relative my-1 pt-5'>
                    <input
                    type='text'
                    data-kt-user-table-filter='search'
                    className='form-control form-control-solid ps-14'
                    style={{width: '250px'}}
                    placeholder='Search'
                    onChange={handleChangeSearch} 
                    value={search}
                    />
                </div>
            </div>
            <div className='card-header border-0 pt-3 flex items-center mx-5'>
                <h3 className='card-title align-items-start col-10'>
                    <span className='card-label fw-bold fs-5 mb-1'>Menu 
                    </span>
                    </h3>
                <div className='card-toolbar text-end'>
                    <Dropdown>
                        <Dropdown.Toggle variant='light' className="btn btn-sm mx-2" id="dropdown-basic">
                        <FontAwesomeIcon icon={faFilter} className='mx-2'/>
                            Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header>Category</Dropdown.Header>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={getMenu}>All</Dropdown.Item>
                            <Dropdown.Item onClick={getMakanan}>Makanan</Dropdown.Item>
                            <Dropdown.Item onClick={getMinuman}>Minuman</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className='card-header border-0 mx-5'>
            <p>Our Favourite Menu is {menuFav.nama_menu}</p>
            </div>
            {/* end::Header */}
                <div className="card-body mx-5 mt-n5">
                    <br/>
                    <div className="row">
                        {menuPerPage.map( (item, index) => {
                            if (search === "" || 
                            item.nama_menu.toLowerCase().includes(search.toLowerCase())
                            ){
                            return(
                            <CardMenuCashier key={index} data-testid="list-item"
                            nama_menu={item.nama_menu}
                            harga={item.harga}
                            gambar={"http://localhost:8080/image/" + item.gambar}
                            onChoose={()=>handleChoose(item)}
                            />
                            )}
                        }) }
                    </div>
                </div>

            {search=="" && 
            <div className='d-flex pt-10 pb-5 px-4 mx-5'>
                <div className='fs-6 fw-semibold text-gray-700 col-10'>Showing {menuNumber} to {menu.length} of entries</div>
                <div id='kt_table_users_paginate'>
                    <ReactPaginate
                    breakLabel="..."
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={0}
                    // previousLabel="previous"
                    // nextLabel="next"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    previousLabel={
                    <div className='text-end col-10 page-item previous'>
                        <div className='page-link' >
                        <FontAwesomeIcon icon={faChevronLeft} className='pb-2'/>
                        </div>
                    </div>
                    }
                    nextLabel={
                    <div className='page-item next'>
                        <div className='page-link' >
                        <FontAwesomeIcon icon={faChevronRight} className='pb-2'/>
                        </div>
                    </div>
                    }
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    />
                </div>
            </div>}
        </div>
  );
}