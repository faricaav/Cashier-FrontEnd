import { useEffect, useState } from "react";
import CardTable from "../components/card_table";
import axios from 'axios';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import styled from 'styled-components'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from "../components/header";
import { faFilter, faPenToSquare, faTrash, faChevronRight, faChevronLeft, faPlus, faXmark, faCircleCheck, faBan } from "@fortawesome/free-solid-svg-icons"

export default function Meja() {
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
  
    useEffect(() => {
        getMeja()
    }, [setCurrentPage]);

    const getMeja = () => {
        axios
        .get("http://localhost:8080/meja/", headerConfig())
        .then((response) => {
          const dataRes = response.data.meja
          console.log(dataRes)
          setMeja(dataRes)
        })
    }

    const getMejaTersedia = () => {
      axios
      .get("http://localhost:8080/filter/tersedia", headerConfig())
      .then((response) => {
        const dataRes = response.data.meja
        console.log(dataRes)
        setMeja(dataRes)
      })
    }

    const getMejaPenuh = () => {
      axios
      .get("http://localhost:8080/filter/tidak_tersedia", headerConfig())
      .then((response) => {
        const dataRes = response.data.meja
        console.log(dataRes)
        setMeja(dataRes)
      })
    }

    const showAlertUpdate = () => {
        swal({
            title: "Success",
            text: "Table Was Updated",
            icon: "success",
        });
    }

    const showAlertAdd = () => {
        swal({
            title: "Success",
            text: "Table Was Created",
            icon: "success",
        });
    }

    const showAlertDelete = () => {
        swal({
            title: "Success",
            text: "Table Was Deleted",
            icon: "success",
        });
    }

    const handleClose = () => {
        setIsModalOpen (false)
    }

    const handleAdd = () => {
        return(
          setIsModalOpen (true),
          setNomorMeja (""),
          setStatus (""),
          setAction ("insert")
        )
    }

    const handleEdit = (item) => {
        let url = "http://localhost:8080/meja" + `/${item.id_meja}`
        axios.get(url, headerConfig(), {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        })
          .then(res => {
            return(
              setIsModalOpen (true),
              setIdMeja(item.id_meja),
              setNomorMeja (item.nomor_meja),
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
        let url = "http://localhost:8080/meja" + `/${item.id_meja}`
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
              getMeja()
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
          id_meja: id_meja,
          nomor_meja: nomor_meja,
          status: status
        }
    
        let url = ""
        if (action === "insert") {
          url = "http://localhost:8080/meja"
          axios.post(url, form, headerConfig())
            .then(response => {
              showAlertAdd()
              getMeja()
              handleClose()
            })
            .catch(error => console.log(error))
        } else if (action === "update") {
          url = "http://localhost:8080/meja" + `/${id_meja}`
          axios.put(url, form, headerConfig())
            .then(response => {
              showAlertUpdate()
              getMeja()
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
                            <Dropdown.Header>Status</Dropdown.Header>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={getMeja}>All</Dropdown.Item>
                            <Dropdown.Item onClick={getMejaTersedia}>Tersedia</Dropdown.Item>
                            <Dropdown.Item onClick={getMejaPenuh}>Tidak Tersedia</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
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
                            <CardTable key={index} data-testid="list-item"
                            nomor_meja={item.nomor_meja}
                            status={item.status === "tersedia" && <p className="text-blue">Tersedia</p> || item.status === "tidak_tersedia" && <p className="text-danger">Tidak Tersedia</p>}
                            onEdit={()=>handleEdit(item)}
                            onDrop={()=>Drop(item)}
                            />
                            )}
                        }) }
                    </div>
                </div>

                <Modal
                id='kt_modal_create_app'
                tabIndex={-1}
                aria-hidden='true'
                dialogClassName='modal-dialog modal-dialog-centered'
                show={isModalOpen}
                onHide={handleClose}
                >
                <div className='modal-header'>
                {action=="update" ? <h2 className="fw-bold fs-5">Edit Table</h2> : <h2 className="fw-bold fs-5">Add Table</h2>}
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
                        <span className='required'>Nomor Meja</span>
                    </label>
                    <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        name='nomor_meja'
                        placeholder=''
                        value={nomor_meja}
                        onChange={event => {
                        setNomorMeja(event.target.value)}}
                    />
                    {!nomor_meja && (
                        <div className='fv-plugins-message-container text-danger text-sm'>
                        <div data-field='nomor_meja' data-validator='notEmpty' className='fv-help-block'>
                            Nomor is required
                        </div>
                        </div>
                    )}
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                        <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Status</span>
                        </label>

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-2'>
                        <span className='d-flex align-items-center me-2'>
                            <span className='d-flex flex-column'>
                            <span className='fs-6'><FontAwesomeIcon icon={faCircleCheck} className='mx-2'/>Tersedia</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='status'
                            value='tersedia'
                            checked={status === 'tersedia'}
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
                            <span className=' fs-6'><FontAwesomeIcon icon={faBan} className='mx-2'/>Tidak Tersedia</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='status'
                            value='tidak_tersedia'
                            checked={status === 'tidak_tersedia'}
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
                        className='btn-lg text-white mt-2'
                        style={{backgroundColor: '#1D4ED8'}}
                        onClick={e => handleSave(e)}
                        disabled={!nomor_meja || !status}
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