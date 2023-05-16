import React from "react"
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CardMenuCashier extends React.Component{
    render(){
    return (
        <div className="col-lg-2 col-sm-12 p-2">
            <div className="card">
                <div className="card-body row" style={{height: '350px'}}>
                    {/* menampilkan Gambar / cover */}
                    <div className="col-12" align="center">
                        <img src={this.props.gambar} className="img rounded mt-2 mb-2"
                        style={{height: "180px", width: "250px"}}/>
                    </div>

                    {/* menampilkan deskripsi */}
                    <br/>
                    <div className="col-12" align="center">
                        <h5 className="text-blue" align="center">
                            { this.props.nama_menu }
                        </h5>
                        <h6 className="text-dark mt-2" align="center">
                            Rp{ this.props.harga}
                        </h6>

                        {/* button untuk detail */}
                        <button className="btn btn-sm btn-primary mt-4 mx-2"
                            onClick={this.props.onChoose}>
                            Choose
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
    }
}
export default CardMenuCashier;