import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsInfoCircle } from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import { updatePassword } from '../../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function PasswordResetModal(props) {
    const [inputValue, setInputValue] = useState({ password: '', confirmPassword: '' });
    const passwordValidation = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{5,}$')
    const tooltipRef = useRef(null);
    const dispatch = useDispatch()
    const isPasswordReset = useSelector(state => state.user.passwordResetInProgress)
    const isUpdatePasswordLoading = useSelector(state => state.user.updatePasswordLoading)
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        dispatch({ type: 'user/resetIsPasswordReset' });
    }, [dispatch]);

    function handleSubmit() {
        if ((inputValue.password === '') && (inputValue.confirmPassword === '')) {
            setPasswordError("Enter a valid password")
            setConfirmPasswordError("Enter a valid confirm password")
        }
        else {
            if (passwordValidation.test(inputValue.password)) {
                if (passwordValidation.test(inputValue.confirmPassword)) {
                    if (inputValue.password === inputValue.confirmPassword) {
                        console.log(inputValue.password + " " + props.values.email);
                        console.log("-----------------")
                        dispatch(updatePassword({
                            password: inputValue.password,
                            email: props.values.email
                        })).then(() => {
                            props.resetInputValueProps();
                            props.onHide();
                        });
                    }
                    else {
                        setConfirmPasswordError("")
                        toast.error('Passwords do not match!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                }
                else {
                    setConfirmPasswordError("Enter a valid confirm password")
                    setPasswordError("");
                }
            }
            else {
                setPasswordError("Enter a valid password")
                setConfirmPasswordError("");
            }
        }
    }

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
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Forgot your password?</Modal.Title>
            </Modal.Header>
            <Modal.Body closeButton>
                {isUpdatePasswordLoading ?
                    <div style={loadingOverlayStyle}>
                        <Spinner className={"mb-2"} animation="border" role="status">
                        </Spinner>
                        <span className="text-dark">Loading...</span>
                    </div>
                    :
                    <div>
                        <div >
                            <div class="mb-3">
                                <p style={{ textAlign: "left", fontWeight: 600 }}> Password<span style={{ color: "red" }}>*</span></p>
                                <div className="input-group">
                                    <input type="password" class="form-control" id="exampleFormControlInput1" placeholder="Password" onChange={(e) => { setInputValue({ ...inputValue, password: e.target.value }) }} />
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="tooltip">Your password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 5 characters long.</Tooltip>}
                                        trigger="click"
                                        rootClose
                                        ref={tooltipRef}
                                    >
                                        <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                            <BsInfoCircle />
                                        </span>
                                    </OverlayTrigger>
                                </div>
                                {passwordError && <p style={{ color: 'red', margin: '5px 0', fontSize: '12px' }}>{passwordError}</p>}
                            </div><br />
                            <div class="mb-3">
                                <p style={{ textAlign: "left", fontWeight: 600 }}> Confirm password<span style={{ color: "red" }}>*</span></p>
                                <div className="input-group">
                                    <input type="password" class="form-control" id="exampleFormControlInput1" placeholder="Password" onChange={(e) => { setInputValue({ ...inputValue, confirmPassword: e.target.value }) }} />
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="tooltip">Your password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 5 characters long.</Tooltip>}
                                        trigger="click"
                                        rootClose
                                        ref={tooltipRef}
                                    >
                                        <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                            <BsInfoCircle />
                                        </span>
                                    </OverlayTrigger>
                                </div>
                                {confirmPasswordError && <p style={{ color: 'red', margin: '5px 0', fontSize: '12px' }}>{confirmPasswordError}</p>}
                            </div>
                        </div>
                        <div className="d-flex flex-row-reverse">
                            <Button variant="secondary" onClick={props.onHide} style={{ marginLeft: "5px" }}>
                                No, Cancel
                            </Button>
                            <Button variant="primary" style={{ backgroundColor: '#F25151', marginLeft: "5px" }} onClick={handleSubmit}>
                                Yes, Proceed
                            </Button>
                        </div>
                    </div>
                }
            </Modal.Body>
        </Modal>
    );
}

