import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import styled from 'styled-components'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from "../components/header";
import '../components/print.css';
import { faFilter, faPenToSquare, faTrash, faChevronRight, faChevronLeft, faCircleCheck, faXmark, faBan, faCircleInfo, faPrint } from "@fortawesome/free-solid-svg-icons"

export default function TransaksiCashier(){
    const [transaksi, setTransaksi]=useState([]); 
    const [transaksi_by_id, setTransaksiById]=useState([]);
    const [detail_transaksi, setDetailTransaksi]=useState([]); 
    const [meja, setMeja]=useState([]); 
    const [user, setUser]=useState([]); 
    const [menu, setMenu]=useState([]); 
    const [id_transaksi, setIdTransaksi]=useState(0);
    const [status, setStatus]=useState("");
    const [isModalOpen, setIsModalOpen]=useState(false);
    const [isDetailOpen, setIsDetailOpen]=useState(false);
    const [action, setAction]=useState("");
    const [search, setSearch]=useState("");
    const [currentPage, setCurrentPage]=useState(0);
    const [error, setError]=useState("");
    const PER_PAGE = 10;
    let [token, setToken]=useState("");

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
    const pageCount = Math.ceil(transaksi.length / PER_PAGE);
    const transaksiPerPage = transaksi.slice(offset, offset + PER_PAGE); 
    const transaksiNumber = transaksiPerPage.length
    
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
  
    useEffect(() => {
        getTransaksi()
    }, [setCurrentPage]);

    const getTransaksi = () => {
        axios
        .get("http://localhost:8080/transaksi/byUser/"+localStorage.getItem("id_user"), headerConfig())
        .then((response) => {
          const dataRes = response.data
          console.log(dataRes)
          setTransaksi(dataRes)
        })
    }

    const getAllTransaksi = () => {
        axios
        .get("http://localhost:8080/transaksi/", headerConfig())
        .then((response) => {
          const dataRes = response.data
          console.log(dataRes)
          setTransaksi(dataRes)
        })
    }

    const getTransaksiById = (item) => {
        axios
        .get("http://localhost:8080/transaksi/" + item.id_transaksi, headerConfig())
        .then((res) => {
            return (
                console.log(res.data),
              setIsDetailOpen(true),
              setTransaksiById(res.data),
              setUser(res.data.user),
              setMeja(res.data.meja),
              setMenu(res.data.menu),
              setDetailTransaksi(res.data.detail_transaksi)
            )
          })
          .catch((ex) => {
            let error = axios.isCancel(ex)
              ? 'Request Cancelled'
              : ex.code === 'ECONNABORTED'
              ? 'A timeout has occurred'
              : ex.response.status === 404
              ? 'Resource Not Found'
              : 'An unexpected error has occurred'
    
            setError(error)
          })
    }

    const getTransaksiLunas = () => {
        axios
        .get("http://localhost:8080/filter/lunas", headerConfig())
        .then((response) => {
          const dataRes = response.data.transaksi
          console.log(dataRes)
          setTransaksi(dataRes)
        })
    }

    const getTransaksiNonLunas = () => {
        axios
        .get("http://localhost:8080/filter/belum_bayar", headerConfig())
        .then((response) => {
          const dataRes = response.data.transaksi
          console.log(dataRes)
          setTransaksi(dataRes)
        })
    }

    const showAlertUpdate = () => {
        swal({
            title: "Success",
            text: "Transaction Data Was Updated",
            icon: "success",
        });
    }

    const showAlertAdd = () => {
        swal({
            title: "Success",
            text: "Transaction Data Was Created",
            icon: "success",
        });
    }

    const showAlertDelete = () => {
        swal({
            title: "Success",
            text: "Transaction Data Was Deleted",
            icon: "success",
        });
    }

    const handleClose = () => {
        setIsModalOpen (false)
        setIsDetailOpen(false)
    }

    const handleEdit = (item) => {
        let url = "http://localhost:8080/transaksi" + `/${item.id_transaksi}`
        axios.get(url, headerConfig(), {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        })
          .then(res => {
            return(
              setIsModalOpen (true),
              setIdTransaksi(item.id_transaksi),
              setStatus (item.status),
              setAction ("update")
            )
          })
          .catch((ex) => {
            let error = axios.isCancel(ex)
              ? 'Request Cancelled'
              : ex.code === 'ECONNABORTED'
              ? 'A timeout has occurred'
              : ex.response.status === 404
              ? 'Resource Not Found'
              : 'An unexpected error has occurred';
      
            setError(error);
          });
    }

    const Drop = (item) => {
        let url = "http://localhost:8080/transaksi" + `/${item.id_transaksi}`
        if (window.confirm("Are you sure to delete this data?")) {
          axios.delete(url, headerConfig(), {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          })
            .then(res => {
              showAlertDelete()
              console.log(res.data.message)
              getTransaksi()
            })
            .catch((ex) => {
              let error = axios.isCancel(ex)
                ? 'Request Cancelled'
                : ex.code === 'ECONNABORTED'
                ? 'A timeout has occurred'
                : ex.response.status === 404
                ? 'Resource Not Found'
                : 'An unexpected error has occurred';
        
              setError(error);
            });
        }
    }

    const handleSave = (e) => {
        e.preventDefault()
    
        let form = {
          id_transaksi: id_transaksi,
          status: status
        }
    
        let url = ""
        if (action === "update") {
          url = "http://localhost:8080/transaksi" + `/${id_transaksi}`
          axios.put(url, form, headerConfig())
            .then(response => {
              showAlertUpdate()
              getTransaksi()
              handleClose()
            })
            .catch((ex) => {
              let error = axios.isCancel(ex)
                ? 'Request Cancelled'
                : ex.code === 'ECONNABORTED'
                ? 'A timeout has occurred'
                : ex.response.status === 404
                ? 'Resource Not Found'
                : 'An unexpected error has occurred';
        
              setError(error);
            });
        }
        setIsModalOpen(false)
    }

    let subtotal=0
      detail_transaksi.map(cartProduct => {
        subtotal += cartProduct.qty * cartProduct.menu.harga;
    })

    return (
        <div className="flex-1 no-printme" >
        <Header />
        <div className={`card mx-auto col-11 mt-5 mb-5 rounded-3`} class="no-printme">
          {/* begin::Header */}
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
                    <span className='card-label fw-bold fs-5 mb-1'>Transaction Data 
                    </span>
                    </h3>
                <div className='card-toolbar text-end'>
                    <Dropdown>
                        <Dropdown.Toggle variant='light' className="btn btn-sm mx-2" id="dropdown-basic">
                        <FontAwesomeIcon icon={faFilter} className='mx-2'/>
                            Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header>Status</Dropdown.Header>
                            <Dropdown.Item onClick={getTransaksiLunas}>Lunas</Dropdown.Item>
                            <Dropdown.Item onClick={getTransaksiNonLunas}>Belum Lunas</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>User</Dropdown.Header>
                            <Dropdown.Item onClick={getAllTransaksi}>All</Dropdown.Item>
                            <Dropdown.Item onClick={getTransaksi}>Only You</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {/* end::Header */}
            {/* begin::Body */}
            <div className='card-body py-3'>
                {/* begin::Table container */}
                <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                    {/* begin::Table head */}
                    <thead>
                    <tr className='fw-bold text-muted' align="center">
                        <th className='min-w-50px'>No</th>
                        <th className='min-w-140px'>User</th>
                        <th className='min-w-140px'>Meja</th>
                        <th className='min-w-120px'>Nama Pelanggan</th>
                        <th className='min-w-120px'>Status</th>
                        <th className='min-w-120px'>Tanggal Transaksi</th>
                        <th className='min-w-80px'>Actions</th>
                    </tr>
                    </thead>
                    {/* end::Table head */}
                    {/* begin::Table body */}
                    <tbody align="center">
                    {transaksiPerPage.length>0 &&
                    transaksiPerPage.map((item, index) => {
                      if ((search === "") || 
                      (item.nama_pelanggan.toLowerCase().includes(search.toLowerCase())) ||
                      (item.user.nama_user.toLowerCase().includes(search.toLowerCase())) ||
                      (item.meja.nomor_meja.toLowerCase().includes(search.toLowerCase()))
                      ){
                        return (
                        <tr key={index}>
                            <td className='text-dark fw-normal fs-6'>
                            {(currentPage*PER_PAGE) + index+1}
                            </td>
                            <td className='text-dark fw-normal fs-6'>
                            {item.user.nama_user}
                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: PH</span> */}
                            </td>
                            <td className='text-dark fw-normal fs-6'>
                            {item.meja.nomor_meja}
                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span> */}
                            </td>
                            <td className='text-dark fw-normal fs-6'>
                            {item.nama_pelanggan}
                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span> */}
                            </td>
                            <td>
                                {item.status === "lunas" && (
                                <Badge bg="success" className="mt-2 mb-2 text-md fw-normal">Lunas</Badge>
                                )}
                                {item.status === "belum_bayar" && (
                                <Badge bg="danger" className="mt-2 mb-2 text-md fw-normal">Belum Bayar</Badge>
                                )}
                            </td>
                            <td className='text-dark fw-normal fs-6'>
                            {item.tgl_transaksi}
                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span> */}
                            </td>
                            <td>
                            <a className='btn btn-sm btn-primary mx-1' onClick={() => getTransaksiById(item)}>
                                <FontAwesomeIcon icon={faCircleInfo}/>
                            </a>
                            <a className='btn btn-sm btn-primary mx-1' onClick={() => handleEdit(item)}>
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </a>
                            <a className='btn btn-sm btn-danger mx-1' onClick={() => Drop(item)}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </a>
                            </td>
                        </tr>
                        )}
                    })}{transaksiPerPage.length===0 &&
                      <tr className="col-lg-12">
                      <td colspan="7" className='text-danger fw-normal fs-6'>
                          Data not found
                      </td>
                      </tr>
                  }
                    </tbody>
                    {/* end::Table body */}
                </table>
                {/* end::Table */}
                </div>
                {/* end::Table container */}
            </div>
            {/* begin::Body */}

            <Modal
        id='kt_modal_create_app'
        tabIndex={-1}
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered mw-500px'
        show={isDetailOpen}
        onHide={handleClose}
        class="printme"
      >
        <div className='modal-header'>
          <div className="flex gap-x-4 items-center"><img
                src="https://www.freepnglogos.com/uploads/coffee-logo-png/coffee-logo-design-creative-idea-logo-elements-2.png"
                style={{height: '30px', width: '30px'}}
                />Detail Transaksi Wikusama Cafe</div>
          {/* begin::Close */}
          <div className='cursor-pointer no-printme' onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark}/>
          </div>
          {/* end::Close */}
        </div>

        <div className='modal-body table-responsive'>
          <table className='table no-margin '>
            <tbody>
              <tr>
                <th scope='row'>
                  <h6>Transaksi ID </h6>
                </th>
                <td>
                  <span>{transaksi_by_id.id_transaksi}</span>
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  <h6>User </h6>
                </th>
                <td>
                  <span>
                    {user.nama_user}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  <h6>Tanggal Transaksi</h6>
                </th>
                <td>
                  <span>
                    { transaksi_by_id.tgl_transaksi}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  <h6>Nama Pelanggan</h6>
                </th>
                <td>
                  <span>
                    {transaksi_by_id.nama_pelanggan}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  <h6>Status</h6>
                </th>
                <td>
                  {transaksi_by_id.status === 'lunas' && <span className='badge badge-primary'>Lunas</span>}
                  {transaksi_by_id.status === 'belum_bayar' && <span className='badge badge-danger'>Belum Bayar</span>}
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  <h6>Meja</h6>
                </th>
                <td>
                  <span>
                    {meja.nomor_meja}
                  </span>
                </td>
              </tr>
              <br></br>
            </tbody>
          </table>
          <h3 align="center" className="text-blue">Rincian Pesanan</h3>
          <div className='modal-body table-responsive'>
                <table className='table '>
                    <tbody>
                    <tr className="mx-5">
                        <th>Menu</th>
                        <th>Harga</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                    {detail_transaksi.map((item, index) => (
                        <tr key={index}>
                            <td>{item.menu.nama_menu}</td>
                            <td>Rp {item.menu.harga}</td>
                            <td>{item.qty}</td>
                            <td className="text-right">Rp { item.menu.harga * item.qty } </td>
                        </tr>
                    ))}
                    </tbody>
                    <h3 className="mt-3 fw-bold" align="center">Total : Rp{subtotal}</h3>
                    <button className="btn-sm btn-warning mt-5 mx-3 col-12 no-printme" onClick={()=>window.print()}><FontAwesomeIcon icon={faPrint}/> <t/> PRINT DETAIL</button>
                </table>
            </div>
        </div>
      </Modal>

            <Modal
                id='kt_modal_create_app'
                tabIndex={-1}
                aria-hidden='true'
                dialogClassName='modal-dialog modal-dialog-centered'
                show={isModalOpen}
                onHide={handleClose}
                >
                <div className='modal-header'>
                <h2 className="fw-bold fs-5">Edit Transaksi</h2>
                    {/* begin::Close */}
                    <div onClick={handleClose} className='cursor-pointer'>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                    {/* end::Close */}
                </div>

                <div className='modal-body py-lg-10 px-lg-10' style={{margin: '25px'}}>
                <div className='current' data-kt-stepper-element='content'>
                <div className='w-500'>
                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                        <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Status</span>
                        </label>

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-2'>
                        <span className='d-flex align-items-center me-2'>
                            <span className='d-flex flex-column'>
                            <span className='fs-6'><FontAwesomeIcon icon={faCircleCheck} className='mx-2'/>Lunas</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='status'
                            value='lunas'
                            checked={status === 'lunas'}
                            onChange={event => {
                                setStatus(event.target.value)}}
                            />
                        </span>
                        </label>
                        {/*end::Option */}

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-2'>
                        <span className='d-flex align-items-center me-2'>
                            <span className='d-flex flex-column'>
                            <span className=' fs-6'><FontAwesomeIcon icon={faBan} className='mx-2'/>Belum Bayar</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='status'
                            value='belum_bayar'
                            checked={status === 'belum_bayar'}
                            onChange={event => {
                                setStatus(event.target.value)}}
                            />
                        </span>
                        </label>
                        {/*end::Option */}
                    </div>
                    {/*end::Form Group */}
                    
                    <div>
                    <button
                        type='submit'
                        className='btn-lg text-white mt-5'
                        style={{backgroundColor: '#1D4ED8'}}
                        onClick={e => handleSave(e)}
                    >
                        Submit
                    </button>
                    </div>
                    {/*end::Form Group */}
                </div>
                </div>
                </div>
            </Modal>
        
            {search=="" && 
            <div className='d-flex flex-stack flex-wrap pt-10 pb-5 px-8'>
                <div className='fs-6 fw-semibold text-gray-700 col-10'>Showing {transaksiNumber} to {transaksi.length} of entries</div>
                <div id='kt_table_users_paginate' class="no-printme">
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
        </div>
    )
}