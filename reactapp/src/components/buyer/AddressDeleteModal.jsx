import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddress, removeAddress } from '../../features/addressSlice';

export default function AddressDeleteModal(props) {
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    async function handleDeleteAddress() {
        await dispatch(removeAddress({ token: token, addressId: props.addressid }));
        dispatch(fetchAddress({ token: token }))
        props.onHide()
    }

    return (
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure to delete?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    No, Cancel
                </Button>
                <Button variant="primary" style={{ backgroundColor: '#F25151' }} onClick={handleDeleteAddress}>
                    Yes, Proceed
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
