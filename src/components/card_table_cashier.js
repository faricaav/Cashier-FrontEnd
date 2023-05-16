import React from "react"
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CardTableCashier extends React.Component{
    render(){
    return (
        <div className="col-lg-2 col-sm-12 p-2">
            <div className="card">
                <div className="card-body row" style={{height: '150px'}}>
                    {/* menampilkan Gambar / cover */}
                    <div className="col-12" align="center">
                        <h1 className="text-blue text-2xl" align="center">
                            { this.props.nomor_meja }
                        </h1>
                    </div>

                    {/* menampilkan deskripsi */}
                    <br/>
                    <div className="col-12 mt-2" align="center">
                        <h5 className="text-blue" align="center">
                            { this.props.status }
                        </h5>

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
export default CardTableCashier;