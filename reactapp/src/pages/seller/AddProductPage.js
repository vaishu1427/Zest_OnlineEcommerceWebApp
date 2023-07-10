import React, { useState } from 'react';
import { SellerData } from "../../components/seller/DummySellerData";
import SellerNavigationBar from '../../components/seller/SellerNavigationBar';
import Footer from '../../components/common/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../features/productSlice';

export default function AddProductPage() {
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    const inputStyle = { input: { paddingLeft: "30px" } };
    const [formValue,setFormValue] = useState({});
    const [systemimage, setImage] = useState(null)
    const blob = new Blob([formValue.image], { type: 'image/jpeg' });
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFormValue({...formValue,image:event.target.files[0]});
        }
    }
    const notify = () => toast("Product has been added successfully.");

    function handleSubmit(){
        console.log(formValue);
        dispatch(addProduct({...formValue,token:token}))
    }
    return (

        <div>
            <SellerNavigationBar/>
            <h3 style={{ marginLeft: 10, marginTop: 8 }}><b>ADD PRODUCT</b></h3>
            <br></br>
                <div style={{ padding: "0px 30px 30px 30px" }}>
                    <label for="exampleFormControlInput1" class="form-label"><b>Image</b></label>
                    <div style={inputStyle.input}>
                        <div class="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div class="card-body">
                                {formValue.image ?<img style={{ paddingTop: "5px" }} height={300} width={300} alt="preview image" src={URL.createObjectURL(blob)} />:<p>No image selected.</p>}<br></br>
                            </div>
                        </div>
                        <input style={{ marginTop: 20 }} type="file" onChange={onImageChange} className="filetype" />
                    </div>
                    <br></br>

                    <label for="exampleFormControlInput1" class="form-label"><b>Product Name</b></label>
                    <div style={inputStyle.input} >
                        <input onChange={(e)=> setFormValue({...formValue,name:e.target.value})} type="text" placeholder='Product name' class="form-control" id="exampleFormControlInput1"></input>
                    </div>
                    <br></br>

                    <label for="exampleFormControlInput1" class="form-label"><b>Product Description</b></label>
                    <div style={inputStyle.input}>
                        <textarea  onChange={(e)=> setFormValue({...formValue,description:e.target.value})} class="form-control" placeholder='Product description' id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <br></br>

                    <label for="exampleFormControlInput1" class="form-label"><b>Price</b></label>
                    <div style={inputStyle.input}>
                        <input type="text" onChange={(e)=> setFormValue({...formValue,price:e.target.value})} placeholder='Product price' class="form-control" id="exampleFormControlInput1"></input>
                    </div>
                    <br></br>

                    <label for="exampleFormControlInput1" class="form-label"><b>Product information</b></label>
                    <br></br>
                    <div className="d-flex justify-content-start" style={inputStyle.input}>
                        <div>
                            <label for="exampleFormControlInput1" class="form-label">Category</label>
                            <input type="text" onChange={(e)=> setFormValue({...formValue,category:e.target.value})} placeholder='Product Category' class="form-control" id="exampleFormControlInput1"></input>
                        </div>
                        <div style={{ marginLeft: "40px" }}>
                            <label for="exampleFormControlInput1" class="form-label">Brand</label>
                            <input type="text" onChange={(e)=> setFormValue({...formValue,brand:e.target.value})} placeholder='Brand name' class="form-control" id="exampleFormControlInput1"></input>
                        </div>
                        <div style={{ marginLeft: "40px" }}>
                            <label for="exampleFormControlInput1" class="form-label">color</label>
                            <input type="text" onChange={(e)=> setFormValue({...formValue,color:e.target.value})} placeholder='Product Color' class="form-control" id="exampleFormControlInput1"></input>
                            <br></br>
                        </div>
                    </div>

                    <label for="exampleFormControlInput1" class="form-label"><b>Quantity</b></label>
                    <div style={inputStyle.input}>
                        <input type="text" onChange={(e)=> setFormValue({...formValue,quantity:e.target.value})} placeholder='Product Quantity' class="form-control" id="exampleFormControlInput1"></input>
                    </div>
                    <br></br>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button onClick={() => {handleSubmit()}} type="submit" class="btn btn-danger" style={{ backgroundColor: "#F25151", color: "black", width: 200 }}><b>Submit</b></button>
                        <ToastContainer />
                    </div>
                </div>
            <Footer/>
        </div>
    )
}