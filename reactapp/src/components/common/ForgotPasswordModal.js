import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { sendVerificationCodeForFP, verifySecurityCode } from '../../features/userSlice';
import PasswordResetModal from './PasswordResetModal';

export default function LogoutModal(props) {
    const [inputValue, setInputValue] = useState({ email: '', securityCode: '' });
    const dispatch = useDispatch()
    const isSecurityCodeVerified = useSelector(state => state.user.verifyingSecuritycode)
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const handleHidePasswordResetModal = () => setShowPasswordResetModal(false);

    const handleSendVerificationCode = () => {
        dispatch(sendVerificationCodeForFP(inputValue))
    }

    async function handleVerificationCode() {
        await dispatch(verifySecurityCode(inputValue));
        // setInputValue({email:" ",securityCode:" "});
        console.log(isSecurityCodeVerified)
        if (isSecurityCodeVerified) {
            console.log(isSecurityCodeVerified)
            setShowPasswordResetModal(true);
            props.onHide();
        }
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot your password?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div >
                        <div class="mb-3">
                            <p style={{ textAlign: "left" }}> Email<span style={{ color: "red" }}>*</span></p>
                            <div className="d-flex flex-row">
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" value={inputValue.email} onChange={(e) => { setInputValue({ ...inputValue, email: e.target.value }) }} />
                                <Button variant="secondary" style={{ marginLeft: "5px" }} onClick={handleSendVerificationCode}>
                                    Send
                                </Button>
                            </div><br />
                            <p style={{ textAlign: "left" }}> Security Code <span style={{ color: "red" }}>*</span></p>
                            <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="080909" value={inputValue.securityCode} onChange={(e) => { setInputValue({ ...inputValue, securityCode: e.target.value }) }} />
                        </div>
                    </div>
                    <div className="d-flex flex-row-reverse">
                        <Button variant="secondary" onClick={props.onHide} style={{ marginLeft: "5px" }}>
                            No, Cancel
                        </Button>
                        <Button variant="primary" style={{ backgroundColor: '#F25151', marginLeft: "5px" }} onClick={handleVerificationCode}>
                            Yes, Proceed
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <PasswordResetModal email={inputValue.email} show={showPasswordResetModal} onHide={handleHidePasswordResetModal} />
        </div>
    );
}

