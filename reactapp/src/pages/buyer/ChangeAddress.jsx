import { useState, useRef, useEffect } from "react";
import NavigationBar from "../../components/common/NavigationBar";
import AddAddressModal from "../../components/buyer/AddAddressModal";
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddress } from "../../features/addressSlice";
import { ReactComponent as Address } from '../../assets/Address.svg';
import AddressDeleteModal from "../../components/buyer/AddressDeleteModal";
import EditAddressModal from "../../components/buyer/EditAddressModal";
import Footer from "../../components/common/Footer";

export default function ChangeAddress() {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const handleHideRemoveModal = () => setShowDeletePopup(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showEditAddressModal, setEditShowAddressModal] = useState(false);
    const handleCloseEditAddressModal = () => setEditShowAddressModal(false);
    const target = useRef(null);
    const handleCloseAddressModal = () => setShowAddressModal(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [selected, setSelected] = useState('')
    const token = useSelector(state => state.user.token)
    const addressList = useSelector(state => state.address.addressList)

    useEffect(() => {
        dispatch(fetchAddress({ token: token }))
    }, [])

    const handleGoBack = () => {
        navigate("/home")
    };

    const handleDeleteAddress = (id) => {
        setSelected(id)
        console.log(selected)
        setShowDeletePopup(true)
    }

    const handleEditAddress = (id) => {
        setSelected(id)
        console.log(selected)
        setEditShowAddressModal(true)
    }

    return (
        <div>
            <NavigationBar /><br /><br /><br />
            <div className='d-flex flex-row align-items-center'>
                <p className='ms-3' ><MdKeyboardBackspace style={{ color: "grey" }} onClick={handleGoBack} />{" "}<a href="#" style={{ color: "grey" }} onClick={handleGoBack}>Back</a></p>
                <p className='ms-3' style={{ fontSize: 30 }}><b>CHANGE ADDRESS</b></p>
                <a ref={target} onClick={() => setShowAddressModal(!showAddressModal)} className='ms-3  text-dark ' href='#addaddress' style={{ fontSize: 15 }}>Add address</a>
            </div>
            <br />
            {addressList.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                    <div style={{ width: 400, height: 400 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <h5 style={{ color: "grey" }}><b>No address added yet</b></h5>
                        </div>
                        <Address />
                    </div>
                </div>
            ) : (
                <div className='container mb-5'>
                    {addressList.map((value, index) => (
                        <div className="row">
                            <div className=" card border container-fluid mt-3 col-md-6 col-md-offset-3 " >
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Address {index + 1}</h5>
                                    <span className="card-text   mt-3">{value.flatNo}</span><br />
                                    <span className="card-text   ">{value.area}</span><br />
                                    <span className="card-text  ">{value.city}</span><br />
                                    <span className="card-text  ">{value.state}</span><br />
                                    <div className=' mb-3  '>{value.pincode}</div>
                                </div>
                                <div className="d-flex flex-row-reverse">
                                    <button
                                        style={{ backgroundColor: '#F25151', color: 'black', margin: '0px 10px 10px 10px' }}
                                        type="button"
                                        className="btn"
                                        onClick={() => handleDeleteAddress(value.id)}
                                    >
                                        <b>Delete</b>
                                    </button>
                                    <button
                                        style={{ backgroundColor: '#F25151', color: 'black', margin: '0px 10px 10px 10px' }}
                                        type="button"
                                        className="btn"
                                        onClick={() => handleEditAddress(value.id)}
                                    >
                                        <b>Edit</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <AddressDeleteModal addressid={selected} show={showDeletePopup} onHide={handleHideRemoveModal} />
            <AddAddressModal show={showAddressModal} onHide={handleCloseAddressModal} />
            {showEditAddressModal ? <EditAddressModal addressid={selected} show={showEditAddressModal} onHide={handleCloseEditAddressModal} /> : <div></div>}
            <br/><br/>
            <Footer/>
        </div>
    )
}