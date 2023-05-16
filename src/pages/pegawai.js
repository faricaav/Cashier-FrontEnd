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
import { faFilter, faPenToSquare, faTrash, faChevronRight, faChevronLeft, faPlus, faXmark, faUserGroup } from "@fortawesome/free-solid-svg-icons"

export default function Pegawai(){
    const [user, setUser]=useState([]); 
    const [id_user, setIdUser]=useState(0);
    const [nama_user, setNamaUser]=useState("");
    const [role, setRole]=useState("");
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [isModalOpen, setIsModalOpen]=useState(false);
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
    const pageCount = Math.ceil(user.length / PER_PAGE);
    const userPerPage = user.slice(offset, offset + PER_PAGE); 
    const userNumber = userPerPage.length
    
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
        getPegawai()
    }, [setCurrentPage]);

    const getPegawai = () => {
        axios
        .get("http://localhost:8080/user/", headerConfig())
        .then((response) => {
          const dataRes = response.data.user
          console.log(dataRes)
          setUser(dataRes)
        })
    }

    const getAdmin = () => {
        axios
        .get("http://localhost:8080/filter/admin", headerConfig())
        .then((response) => {
          const dataRes = response.data.user
          console.log(dataRes)
          setUser(dataRes)
        })
    }

    const getKasir = () => {
        axios
        .get("http://localhost:8080/filter/kasir", headerConfig())
        .then((response) => {
          const dataRes = response.data.user
          console.log(dataRes)
          setUser(dataRes)
        })
    }

    const getManajer = () => {
        axios
        .get("http://localhost:8080/filter/manajer", headerConfig())
        .then((response) => {
          const dataRes = response.data.user
          console.log(dataRes)
          setUser(dataRes)
        })
    }

    const showAlertUpdate = () => {
        swal({
            title: "Success",
            text: "User Data Was Updated",
            icon: "success",
        });
    }

    const showAlertAdd = () => {
        swal({
            title: "Success",
            text: "User Data Was Created",
            icon: "success",
        });
    }

    const showAlertDelete = () => {
        swal({
            title: "Success",
            text: "User Data Was Deleted",
            icon: "success",
        });
    }

    const showAlertDanger = () => {
        swal({
            title: "Fail",
            text: "Created User Was Failed",
            icon: "error",
        });
    }

    const handleClose = () => {
        setIsModalOpen (false)
    }

    const handleAdd = () => {
        return(
          setIsModalOpen (true),
          setNamaUser (""),
          setUsername (""),
          setRole (""),
          setPassword (""),
          setAction ("insert")
        )
    }

    const handleEdit = (item) => {
        let url = "http://localhost:8080/user" + `/${item.id_user}`
        axios.get(url, headerConfig(), {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        })
          .then(res => {
            return(
              setIsModalOpen (true),
              setIdUser(item.id_user),
              setNamaUser (item.nama_user),
              setUsername (item.username),
              setPassword (item.password),
              setRole (item.role),
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
        let url = "http://localhost:8080/user" + `/${item.id_user}`
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
              getPegawai()
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
          id_user: id_user,
          nama_user: nama_user,
          username: username,
          password: password,
          role: role
        }
    
        let url = ""
        if (action === "insert") {
          url = "http://localhost:8080/user"
          axios.post(url, form, headerConfig())
            .then(response => {
                if(response.data.message !== "Username has been used"){
                    showAlertUpdate()
                    getPegawai()
                    handleClose()
                } else {
                    showAlertDanger()
                }
            })
            .catch(error => console.log(error))
        } else if (action === "update") {
          url = "http://localhost:8080/user" + `/${id_user}`
          axios.put(url, form, headerConfig())
            .then(response => {
                console.log(response)
                if(response.data.message !== "Username already taken"){
                    showAlertUpdate()
                    getPegawai()
                    handleClose()
                } else {
                    showAlertDanger()
                }
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

    return (
        <div className="flex-1">
        <Header/>
        <div className={`card mx-auto col-11 mt-5 mb-5 rounded-3`}>
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
                    <span className='card-label fw-bold fs-5 mb-1'>Users Data 
                        <button
                        className="btn btn-sm btn-primary ml-3"
                        style={{borderRadius:'12px'}}
                        data-toggle="modal"
                        data-target="#modal"
                        onClick={() => handleAdd()}
                        >
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                    </span>
                    </h3>
                <div className='card-toolbar text-end'>
                    <Dropdown>
                        <Dropdown.Toggle variant='light' className="btn btn-sm mx-2" id="dropdown-basic">
                        <FontAwesomeIcon icon={faFilter} className='mx-2'/>
                            Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header>Role</Dropdown.Header>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={getPegawai}>All</Dropdown.Item>
                            <Dropdown.Item onClick={getKasir}>Kasir</Dropdown.Item>
                            <Dropdown.Item onClick={getAdmin}>Admin</Dropdown.Item>
                            <Dropdown.Item onClick={getManajer}>Manajer</Dropdown.Item>
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
                        <th className='min-w-140px'>Name</th>
                        <th className='min-w-140px'>Username</th>
                        <th className='min-w-120px'>Role</th>
                        <th className='min-w-80px'>Actions</th>
                    </tr>
                    </thead>
                    {/* end::Table head */}
                    {/* begin::Table body */}
                    <tbody align="center">
                    {userPerPage.length>0 &&
                    userPerPage.map((item, index) => {
                        if (search === "" || 
                        item.nama_user.toLowerCase().includes(search.toLowerCase()) ||
                        item.username.toLowerCase().includes(search.toLowerCase())
                        ){
                        return (
                        <tr key={index}>
                            <td className='text-dark fw-normal fs-6'>
                            {(currentPage*PER_PAGE) + index+1}
                            </td>
                            <td className='text-dark fw-normal fs-6'>
                            {item.nama_user}
                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: PH</span> */}
                            </td>
                            <td className='text-dark fw-normal fs-6'>
                            {item.username}
                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>Code: Paid</span> */}
                            </td>
                            <td>
                                {item.role === "admin" && (
                                <Badge bg="success" className="mt-2 mb-2 text-md fw-normal">Admin</Badge>
                                )}
                                {item.role === "kasir" && (
                                <Badge bg="primary" className="mt-2 mb-2 text-md fw-normal">Kasir</Badge>
                                )}
                                {item.role === "manajer" && (
                                <Badge bg="secondary" className="mt-2 mb-2 text-md fw-normal">Manajer</Badge>
                                )}
                            </td>
                            <td>
                            <a className='btn btn-sm btn-primary mx-1' onClick={() => handleEdit(item)}>
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </a>
                            <a className='btn btn-sm btn-danger mx-1' onClick={() => Drop(item)}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </a>
                            </td>
                        </tr>
                        )}
                    })}{userPerPage.length===0 &&
                        <tr className="col-lg-12">
                        <td colspan="5" className='text-danger fw-normal fs-6'>
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
                dialogClassName='modal-dialog modal-dialog-centered'
                show={isModalOpen}
                onHide={handleClose}
                >
                <div className='modal-header'>
                {action=="update" ? <h2 className="fw-bold fs-5">Edit User</h2> : <h2 className="fw-bold fs-5">Add User</h2>}
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
                    <div className='fv-row mb-2'>
                    <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Name</span>
                    </label>
                    <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        name='nama_user'
                        placeholder=''
                        value={nama_user}
                        onChange={event => {
                        setNamaUser(event.target.value)}}
                    />
                    {!nama_user && (
                        <div className='fv-plugins-message-container text-danger text-sm'>
                        <div data-field='nama_user' data-validator='notEmpty' className='fv-help-block'>
                            Name is required
                        </div>
                        </div>
                    )}
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                    <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Username</span>
                    </label>
                    <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        name='username'
                        placeholder=''
                        value={username}
                        onChange={event => {
                        setUsername(event.target.value)}}
                    />
                    {!username && (
                        <div className='fv-plugins-message-container text-danger text-sm'>
                        <div data-field='username' data-validator='notEmpty' className='fv-help-block'>
                            Username is required
                        </div>
                        </div>
                    )}
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                    <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Password</span>
                    </label>
                    <input
                        type='password'
                        className='form-control form-control-lg form-control-solid'
                        name='password'
                        placeholder=''
                        value={password}
                        onChange={event => {
                        setPassword(event.target.value)}}
                    />
                    {!password && (
                        <div className='fv-plugins-message-container text-danger text-sm'>
                        <div data-field='password' data-validator='notEmpty' className='fv-help-block'>
                            Password is required
                        </div>
                        </div>
                    )}
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                        <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Role</span>
                        </label>

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-2'>
                        <span className='d-flex align-items-center me-2'>
                            <span className='d-flex flex-column'>
                            <span className='fs-6'><FontAwesomeIcon icon={faUserGroup} className='mx-2'/>Manajer</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='role'
                            value='manajer'
                            checked={role === 'manajer'}
                            onChange={event => {
                                setRole(event.target.value)}}
                            />
                        </span>
                        </label>
                        {/*end::Option */}

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-2'>
                        <span className='d-flex align-items-center me-2'>
                            <span className='d-flex flex-column'>
                            <span className=' fs-6'><FontAwesomeIcon icon={faUserGroup} className='mx-2'/>Admin</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='role'
                            value='admin'
                            checked={role === 'admin'}
                            onChange={event => {
                                setRole(event.target.value)}}
                            />
                        </span>
                        </label>
                        {/*end::Option */}

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-6'>
                        <span className='d-flex align-items-center me-2'>

                            <span className='d-flex flex-column'>
                            <span className=' fs-6'><FontAwesomeIcon icon={faUserGroup} className='mx-2'/>Kasir</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='role'
                            value='kasir'
                            checked={role === 'kasir'}
                            onChange={event => {
                                setRole(event.target.value)}}
                            />
                        </span>
                        </label>
                        {/*end::Option */}
                    </div>
                    {/*end::Form Group */}
                    
                    <div>
                    <button
                        type='submit'
                        className='btn-lg text-white'
                        style={{backgroundColor: '#1D4ED8'}}
                        onClick={e => handleSave(e)}
                        disabled={!nama_user || !username || !role || !password}
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
                <div className='fs-6 fw-semibold text-gray-700 col-10'>Showing {userNumber} to {user.length} of entries</div>
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
        </div>
    )
}