import React, {useState} from "react"
import axios from "axios"
import {
    MDBBtn,
    MDBContainer,
    MDBInput,
    MDBIcon,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';

export default function Register(){
    const [nama_user, setNamaUser]=useState("");
    const [username, setUsername]=useState(""); 
    const [password, setPassword]=useState(""); 
    const [role, setRole]=useState(""); 

    const handleRegister = (e) => {
        e.preventDefault()
        let data = {
            nama_user: nama_user,
            username: username,
            password: password,
            role: role
        }
        let url = "http://localhost:8080/user"
        axios.post(url, data)
        .then(res => {
            window.alert("Your account has been successful added")
            window.location = "/"
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

            <h3 className="fw-normal mb-3 ps-5 pb-3 pt-lg-5 pb-lg-5 text-xl">Hello, Please Register Your Account</h3>

            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Nama' type='text' size="lg" 
            value={nama_user} onChange={event => {setNamaUser(event.target.value)}}/>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Username' type='text' size="lg" 
            value={username} onChange={event => {setUsername(event.target.value)}}/>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' type='password' size="lg"
            value={password} onChange={event => {setPassword(event.target.value)}}/>
            <select name="role"
                onChange={event => {setRole(event.target.value)}} className="mb-4 mx-5 px-2 w-100 pb-lg-2 pt-lg-2 border-3 rounded" size="lg">
                <option value={role} label="Choose Role"></option>
                <option value="admin">Admin</option>
                <option value="kasir">Kasir</option>
                <option value="manajer">Manajer</option>
            </select>
            <MDBBtn className="mb-4 px-5 mx-5 w-100" size='lg' style={{backgroundColor: '#1D4ED8'}} onClick={(e) => handleRegister(e)}>Register</MDBBtn>

          </div>

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://img.qraved.co/v2/image/data/1525688655197-30995912_429489254179294_8126549982024040448_n-m.jpg" style={{display: 'flex', position: 'fixed', width: '50%', height: '100%'}} />
        </MDBCol>

      </MDBRow>

    </MDBContainer>
    )
}