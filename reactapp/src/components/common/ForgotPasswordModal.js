import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { sendVerificationCodeForFP, verifySecurityCode } from '../../features/userSlice';
import PasswordResetModal from './PasswordResetModal';

export default function LogoutModal(props) {
    const [inputValue, setInputValue] = useState({ email: '', securityCode: '' });
    const dispatch = useDispatch()
    const isSendVerification = useSelector(state => state.user.sendVerificationInProgress)
    const sendVerificationLoading = useSelector(state => state.user.sendVerificationLoading)
    const verifySecuritycodeLoading = useSelector(state => state.user.verifySecuritycodeLoading)
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const [emailError, setEmailError] = useState(''); 
    const [OTPError, setOTPError] = useState('');

    useEffect(() => {
        dispatch({ type: 'user/resetIsSendVerification' });
        setEmailError('')
        setOTPError('')
    }, [props.show, dispatch]);

    const handleHidePasswordResetModal = () => setShowPasswordResetModal(false);

    const handleSendVerificationCode = () => {
        if (validateEmail(inputValue.email)) {
            setEmailError('');
            setOTPError('')
            dispatch(sendVerificationCodeForFP(inputValue))
        } else {
            setOTPError('');
            setEmailError('Please enter a valid email address.');
        }
    }

    async function handleVerificationCode() {
        if (validateEmail(inputValue.email)) {
            if (isSendVerification) {
                if (validateSecurityCode(inputValue.securityCode)) {
                    const isCodeVerified = await dispatch(verifySecurityCode(inputValue));
                    console.log(isCodeVerified);
                    if (isCodeVerified.payload !== undefined) {
                        await setShowPasswordResetModal(true);
                        props.onHide();
                    } else {
                        setOTPError('Invalid security code');
                    }
                } else {
                    setOTPError('Enter a valid security code');
                }
            } else {
                setEmailError('');
                setOTPError('Send the email to get OTP');
            }
        } else {
            setEmailError('Please enter a valid email address.');
        }
    }
    

    const validateEmail = (email) => {
        const emailRegex = /^[a-z0-9._]+@gmail\.com$/;
        return emailRegex.test(email);
    }

    const validateSecurityCode = (securityCode) => {
        const securityCodeRegex = /^\d{6}$/;
        return securityCodeRegex.test(securityCode);
    }

    const handleResetInputValueProps = () => {
        console.log("Called");
        setInputValue({...inputValue, email: '', securityCode: '' });
        console.log(inputValue.email+" "+inputValue.securityCode)
    };

    const loadingOverlayStyle = {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 9999,
    };

    return (
        <div>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot your password?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {sendVerificationLoading || verifySecuritycodeLoading ?
                        <div style={loadingOverlayStyle}>
                            <Spinner className={"mb-2"} animation="border" role="status">
                            </Spinner>
                            <span className="text-dark">Loading...</span>
                        </div>
                        :
                        <div>
                            <div >
                                <div className="mb-3">
                                    <p style={{ textAlign: "left", fontWeight: 600 }}> Email<span style={{ color: "red" }}>*</span></p>
                                    <div className="d-flex flex-row">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="name@example.com"
                                            value={inputValue.email}
                                            disabled={isSendVerification}
                                            onChange={(e) => { setInputValue({ ...inputValue, email: e.target.value }) }}
                                        />
                                        <Button variant="secondary" style={{ marginLeft: "5px" }} onClick={handleSendVerificationCode} disabled={isSendVerification} >
                                            Send
                                        </Button>
                                    </div>
                                    {emailError && <p style={{ color: 'red', margin: '5px 0', fontSize: '12px' }}>{emailError}</p>}
                                    <br />
                                    <p style={{ textAlign: "left", fontWeight: 600 }}> Security Code<span style={{ color: "red" }}>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        placeholder="ex: 080909"
                                        value={inputValue.securityCode}
                                        onChange={(e) => { setInputValue({ ...inputValue, securityCode: e.target.value }) }}
                                        disabled={!isSendVerification}
                                    />
                                    {OTPError && <p style={{ color: 'red', margin: '5px 0', fontSize: '12px' }}>{OTPError}</p>}
                                </div>
                            </div>

                            <div className="d-flex flex-row-reverse">
                                <Button variant="secondary" onClick={props.onHide} style={{ marginLeft: "5px" }}>
                                    No, Cancel
                                </Button>
                                <Button variant="primary" style={{ backgroundColor: '#F25151', marginLeft: "5px" }} onClick={handleVerificationCode} disabled={!isSendVerification}>
                                    Yes, Proceed
                                </Button>
                            </div>
                        </div>
                    }
                </Modal.Body>
            </Modal>
            <PasswordResetModal values={inputValue} show={showPasswordResetModal} onHide={handleHidePasswordResetModal} resetInputValueProps={handleResetInputValueProps}/>
        </div>
    );
}
