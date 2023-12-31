import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddress, fetchAddressById, updateAddress } from "../../features/addressSlice";

export default function EditAddressModal(props) {
    const [formValue, setFormValue] = useState({});
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    const particularAddress = useSelector(state => state.address.particularAddress)

    useEffect(() => {
        async function fetch() {
            await dispatch(fetchAddressById({ token: token, addressId: props.addressid }))
        }
        fetch()

    }, [])

    useEffect(() => {
        setFormValue({
            ...formValue,
            flatNo: particularAddress?.flatNo,
            area: particularAddress?.area,
            city: particularAddress?.city,
            state: particularAddress?.state,
            pincode: particularAddress?.pincode
        })
        console.log(formValue);
    }, [particularAddress])

    console.log(particularAddress);

    async function handleSubmit() {
        await dispatch(updateAddress({ ...formValue, addressId: props.addressid, token: token }))
        dispatch(fetchAddress({ token: token }))
        props.onHide()
    }

    return (
        <Offcanvas placement={'end'} show={props.show} onHide={() => props.onHide()}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title><b>Edit Address</b></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div class="container">
                    <div class="mb-3">
                        <p style={{ textAlign: "left" }}> Flat, House no., Building, Company, Apartment</p>
                        <input value={formValue.flatNo} onChange={(e) => setFormValue({ ...formValue, flatNo: e.target.value })} type="flat-no" class="form-control" id="exampleFormControlInput1" />
                    </div>
                    <div class="mb-3">
                        <p style={{ textAlign: "left" }}> Area, Street, Sector, Village</p>
                        <input value={formValue.area} onChange={(e) => setFormValue({ ...formValue, area: e.target.value })} type="area" class="form-control" id="exampleFormControlInput1" />
                    </div>
                    <div class="mb-3">
                        <p style={{ textAlign: "left" }}> Town/City</p>
                        <input value={formValue.city} onChange={(e) => setFormValue({ ...formValue, city: e.target.value })} type="city" class="form-control" id="exampleFormControlInput1" />
                    </div>
                    <div class="mb-3">
                        <p style={{ textAlign: "left" }}> State</p>
                        <input value={formValue.state} onChange={(e) => setFormValue({ ...formValue, state: e.target.value })} type="state" class="form-control" id="exampleFormControlInput1" />
                    </div>
                    <div class="mb-3">
                        <p style={{ textAlign: "left" }}> Pincode</p>
                        <input value={formValue.pincode} onChange={(e) => setFormValue({ ...formValue, pincode: e.target.value })} type="pincode" class="form-control" id="exampleFormControlInput1" />
                    </div>

                    <br></br>
                    <div className="d-flex justify-content-center">
                        <button onClick={() => handleSubmit()} className="btn btn-danger mt-3" style={{ color: "black" }}><b>Submit</b></button>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    )
}