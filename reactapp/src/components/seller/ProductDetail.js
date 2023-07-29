import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { MdKeyboardBackspace } from 'react-icons/md';
import { fetchProductById } from "../../features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductDetail = (props) => {
    const token = useSelector(state => state.user.token)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchProductById({ token: token, productId: props.productId }))
    }, [])
    const productDetails = useSelector(state => state.product.productDetails)
    const handleGoBack = () => {
        navigate("/seller/home")
    };

    return (
        <div>
            <div className="d-flex flex-row align-items-center">
                <p className='ms-3' ><MdKeyboardBackspace style={{ color: "grey" }} onClick={handleGoBack} />{" "}<a href="#" style={{ color: "grey" }} onClick={handleGoBack}>Back</a></p>
                <p className='ms-3' style={{ fontSize: 30 }}><b>BUYERS</b></p>
            </div>
            <br />
            <div className="container">
                <Col className="d-flex justify-content-center">
                    <div className="d-flex mt-3">
                        <img src={`data:image/jpeg;base64,${productDetails?.image}`} width={103} height={92} style={{ marginRight: '40px' }} className='figure-img img-fluid rounded shadow-3 mb-3' alt='...' />
                        <div>
                            <h6> <b>{productDetails.name}</b></h6>
                            <p className="text-success fw-bold fs-5">{`₹ ${productDetails?.price?.toLocaleString("en-US")}`}</p>
                        </div>
                    </div>
                </Col>
            </div><br />
        </div>
    );
};

export default ProductDetail;