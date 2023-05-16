import { useEffect, useState } from "react";
import CardMenu from "../components/card_menu";
import axios from 'axios';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import styled from 'styled-components'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from "../components/header";
import { faFilter, faPenToSquare, faTrash, faChevronRight, faChevronLeft, faPlus, faXmark, faBowlFood, faMugSaucer } from "@fortawesome/free-solid-svg-icons"

export default function Menu() {
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

    const getMenuFav = () => {
        axios
        .get("http://localhost:8080/filter/most", headerConfig())
        .then((response) => {
          const dataRes = response.data.menu
          console.log(dataRes)
          setMenuFav(dataRes)
        })
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

    const showAlertUpdate = () => {
        swal({
            title: "Success",
            text: "Menu Was Updated",
            icon: "success",
        });
    }

    const showAlertAdd = () => {
        swal({
            title: "Success",
            text: "Menu Was Created",
            icon: "success",
        });
    }

    const showAlertDanger = () => {
        swal({
            title: "Fail",
            text: "Created Menu Was Failed",
            icon: "error",
        });
    }

    const showAlertDelete = () => {
        swal({
            title: "Success",
            text: "Menu Was Deleted",
            icon: "success",
        });
    }

    const handleClose = () => {
        setIsModalOpen (false)
    }

    const handleAdd = () => {
        return(
          setIsModalOpen (true),
          setNamaMenu (""),
          setJenis (""),
          setDeskripsi (""),
          setGambar (null),
          setHarga(0),
          setAction ("insert")
        )
    }

    const handleEdit = (item) => {
        let url = "http://localhost:8080/menu" + `/${item.id_menu}`
        axios.get(url, headerConfig(), {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        })
          .then(res => {
            return(
              setIsModalOpen (true),
              setIdMenu(item.id_menu),
              setNamaMenu (item.nama_menu),
              setJenis (item.jenis),
              setDeskripsi (item.deskripsi),
              setGambar (item.gambar),
              setHarga (item.harga),
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
        let url = "http://localhost:8080/menu" + `/${item.id_menu}`
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
              getMenu()
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
    
        let form = new FormData()
        form.append("nama_menu", nama_menu)
        form.append("gambar", gambar)
        form.append("deskripsi", deskripsi)
        form.append("harga", harga)
        form.append("jenis", jenis)
    
        let url = ""
        if (action === "insert") {
          url = "http://localhost:8080/menu"
          axios.post(url, form, headerConfig())
            .then(response => {
                if(response.data.message !== "price can not smaller than 0"){
                    showAlertAdd()
                    getMenu()
                    handleClose()
                }else{
                    showAlertDanger()
                }
            })
            .catch(error => console.log(error))
        } else if (action === "update") {
          url = "http://localhost:8080/menu" + `/${id_menu}`
          axios.put(url, form, headerConfig())
            .then(response => {
                if(response.data.message !== "price can not smaller than 0"){
                    showAlertUpdate()
                    getMenu()
                    handleClose()
                }else{
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
                            <CardMenu key={index} data-testid="list-item"
                            nama_menu={item.nama_menu}
                            harga={item.harga}
                            gambar={"http://localhost:8080/image/" + item.gambar}
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
                {action=="update" ? <h2 className="fw-bold fs-5">Edit Menu</h2> : <h2 className="fw-bold fs-5">Add Menu</h2>}
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
                        name='nama_menu'
                        placeholder=''
                        value={nama_menu}
                        onChange={event => {
                        setNamaMenu(event.target.value)}}
                    />
                    {!nama_menu && (
                        <div className='fv-plugins-message-container text-danger text-sm'>
                        <div data-field='nama_menu' data-validator='notEmpty' className='fv-help-block'>
                            Name is required
                        </div>
                        </div>
                    )}
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                    <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Price</span>
                    </label>
                    <input
                        type='number'
                        min={0}
                        className='form-control form-control-lg form-control-solid'
                        name='harga'
                        placeholder=''
                        value={harga}
                        onChange={event => {
                        setHarga(event.target.value)}}
                    />
                    {!harga && (
                        <div className='fv-plugins-message-container text-danger text-sm'>
                        <div data-field='harga' data-validator='notEmpty' className='fv-help-block'>
                            Price is required and must higher than 0
                        </div>
                        </div>
                    )}
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                    <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Deskripsi</span>
                    </label>
                    <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        name='deskripsi'
                        placeholder=''
                        value={deskripsi}
                        onChange={event => {
                        setDeskripsi(event.target.value)}}
                    />
                    {!deskripsi && (
                        <div className='fv-plugins-message-container text-danger text-sm'>
                        <div data-field='deskripsi' data-validator='notEmpty' className='fv-help-block'>
                            Deskripsi is required
                        </div>
                        </div>
                    )}
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                    <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Image</span>
                    </label>
                    <input
                        type='file'
                        className='form-control form-control-lg form-control-solid'
                        name='gambar'
                        placeholder=''
                        onChange={event => {setGambar(event.target.files[0])}}
                    />
                    </div>
                    {/*end::Form Group */}

                    {/*begin::Form Group */}
                    <div className='fv-row mt-4 mb-2'>
                        <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                        <span className='required'>Jenis</span>
                        </label>

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-2'>
                        <span className='d-flex align-items-center me-2'>
                            <span className='d-flex flex-column'>
                            <span className='fs-6'><FontAwesomeIcon icon={faBowlFood} className='mx-2'/>Makanan</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='jenis'
                            value='makanan'
                            checked={jenis === 'makanan'}
                            onChange={event => {
                                setJenis(event.target.value)}}
                            />
                        </span>
                        </label>
                        {/*end::Option */}

                        {/*begin:Option */}
                        <label className='d-flex align-items-center justify-content-between cursor-pointer mb-2'>
                        <span className='d-flex align-items-center me-2'>
                            <span className='d-flex flex-column'>
                            <span className=' fs-6'><FontAwesomeIcon icon={faMugSaucer} className='mx-2'/>Minuman</span>
                            </span>
                        </span>

                        <span className='form-check form-check-custom form-check-solid'>
                            <input
                            className='form-check-input'
                            type='radio'
                            name='jenis'
                            value='minuman'
                            checked={jenis === 'minuman'}
                            onChange={event => {
                                setJenis(event.target.value)}}
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
                        disabled={!nama_menu || !harga || !deskripsi || !jenis}
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