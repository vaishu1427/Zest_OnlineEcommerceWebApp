import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
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
    const token = useSelector((state) => state.user.token);
    function handleSubmit() {
        if ((inputValue.password === '') || (inputValue.confirmPassword === '')) {
            toast.error('Fill out all fields !', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else {
            if (passwordValidation.test(inputValue.password)) {
                if (passwordValidation.test(inputValue.confirmPassword)) {
                    if (inputValue.password === inputValue.confirmPassword) {
                        console.log(inputValue.password + " " + props.email);
                        console.log("-----------------")
                        dispatch(updatePassword({
                            password: inputValue.password,
                            email: props.email
                        }))
                    }
                    else {
                        toast.error('Passwords do not match!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                }
                else {
                    toast.error('Enter a valid password!', {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            }
            else {
                toast.error('Enter a valid confirm password!', {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    }

    return (
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Forgot your password?</Modal.Title>
            </Modal.Header>
            <Modal.Body closeButton>
                <div >
                    <div class="mb-3">
                        <p style={{ textAlign: "left" }}> Password<span style={{ color: "red" }}>*</span></p>
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
                    </div><br />
                    <div class="mb-3">
                        <p style={{ textAlign: "left" }}> Confirm password<span style={{ color: "red" }}>*</span></p>
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
            </Modal.Body>
        </Modal>
    );
}

