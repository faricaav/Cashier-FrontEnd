import { useEffect, useState } from "react";
import CardTableCashier from "../components/card_table_cashier";
import axios from 'axios';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import styled from 'styled-components'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from "../components/header_cashier";
import { useNavigate } from "react-router-dom";
import { faFilter, faPenToSquare, faTrash, faChevronRight, faChevronLeft, faPlus, faXmark, faCircleCheck, faBan } from "@fortawesome/free-solid-svg-icons"

export default function ChooseTable() {
    const [meja, setMeja]=useState([]); 
    const [id_meja, setIdMeja]=useState(0);
    const [nomor_meja, setNomorMeja]=useState("");
    const [status, setStatus]=useState("");
    const [isModalOpen, setIsModalOpen]=useState(false);
    const [action, setAction]=useState("");
    const [search, setSearch]=useState("");
    const [currentPage, setCurrentPage]=useState(0);
    const [error, setError]=useState("");
    const PER_PAGE = 12;
    let [token, setToken]=useState("");
    const navigate = useNavigate()

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
    const pageCount = Math.ceil(meja.length / PER_PAGE);
    const mejaPerPage = meja.slice(offset, offset + PER_PAGE); 
    const mejaNumber = mejaPerPage.length
    
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

    const handleChoose = (item) => {
        let confirmAction = window.confirm("Choose " + item.nomor_meja + " ?")
          if (confirmAction) {
            localStorage.setItem("id_meja", item.id_meja);
            localStorage.setItem("nomor_meja", item.nomor_meja);
            let nama_pelanggan = window.prompt("Customer Name : " , "");
            localStorage.setItem("nama_pelanggan", nama_pelanggan);
            navigate('/chooseMenu')    
          } else {
            alert("Canceled to choose table");
          }
    }
  
    useEffect(() => {
        getMeja()
    }, [setCurrentPage]);

    const getMeja = () => {
        axios
        .get("http://localhost:8080/filter/tersedia", headerConfig())
        .then((response) => {
          const dataRes = response.data.meja
          console.log(dataRes)
          setMeja(dataRes)
        })
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
                    <span className='card-label fw-bold fs-5 mb-1'>Table 
                    </span>
                    </h3>
            </div>
            {/* end::Header */}
                <div className="card-body mx-5 mt-n5">
                    <br/>
                    <div className="row">
                        {mejaPerPage.map( (item, index) => {
                            if (search === "" || 
                            item.nomor_meja.toLowerCase().includes(search.toLowerCase())
                            ){
                            return(
                            <CardTableCashier key={index} data-testid="list-item"
                            nomor_meja={item.nomor_meja}
                            status={item.status === "tersedia" && "Tersedia" || item.status === "tidak_tersedia" && "Tidak Tersedia"}
                            onChoose={()=>handleChoose(item)}
                            />
                            )}
                        }) }
                    </div>
                </div>
                {search=="" && 
            <div className='d-flex pt-10 pb-5 px-4 mx-5'>
                <div className='fs-6 fw-semibold text-gray-700 col-10'>Showing {mejaNumber} to {meja.length} of entries</div>
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