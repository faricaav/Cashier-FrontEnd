import React, {useState} from "react"
import { Link } from "react-router-dom";
import axios from "axios"
import {
    MDBBtn,
    MDBContainer,
    MDBInput,
    MDBIcon,
    MDBRow,
    MDBCol,
} from 'mdb-react-ui-kit';

export default function Login(){
    const [username, setUsername]=useState(""); 
    const [password, setPassword]=useState(""); 

    const handleLogin = (e) => {
        e.preventDefault()
        let data = {
        username: username,
        password: password
        }
        let url = "http://localhost:8080/login"
        axios.post(url, data)
        .then(res => {
            if (res.data.logged === true) {
                let nama_user = res.data.data.nama_user         
                let token = res.data.token
                let id_user = res.data.data.id_user
                let role = res.data.data.role
                localStorage.setItem("nama_user", nama_user)
                localStorage.setItem("token", token)
                localStorage.setItem("role", role)
                localStorage.setItem("id_user", id_user)
                if(role!==null && role!==""){
                    window.location = "/dashboard"
                }
            }
            else {
            window.alert(res.data.message)
            }
        })
    }

    return(
      <MDBContainer fluid style={{position: 'fixed'}}>
      <MDBRow>

        <MDBCol sm='6'>

          <div className='d-flex flex-row ps-5 pt-lg-5'>
            <MDBIcon className="pt-lg-4"><img src="https://www.freepnglogos.com/uploads/coffee-logo-png/coffee-logo-design-creative-idea-logo-elements-2.png" style={{height: '80px', width: '80px'}}/></MDBIcon>
            <span className="h1 fw-bold mb-0 pt-lg-5 pb-lg-5">Wikusama Cafe</span>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-lg-5'>

            <h3 className="fw-normal mb-3 ps-5 pb-3 pt-lg-5 pb-lg-5 text-xl">Hello, Please Login</h3>

            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Username' type='text' size="lg" 
            value={username} onChange={event => {setUsername(event.target.value)}}/>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' type='password' size="lg"
            value={password} onChange={event => {setPassword(event.target.value)}}/>

            <MDBBtn className="mb-4 px-5 mx-5 w-100" size='lg' style={{backgroundColor: '#1D4ED8'}} onClick={(e) => handleLogin(e)}>Login</MDBBtn>
            {/* <p className='ms-5'>Don't have an account? <Link to="/register" className="link" style={{color: '#1D4ED8'}}>Register here</Link></p> */}

          </div>

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://img.qraved.co/v2/image/data/1525688655197-30995912_429489254179294_8126549982024040448_n-m.jpg" style={{display: 'flex', position: 'fixed', width: '50%', height: '100%'}} />
        </MDBCol>

      </MDBRow>

    </MDBContainer>
    )
}