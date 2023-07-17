import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {toast} from "react-toastify";
import {createPurchase, getPurchaseByBuyer, } from "../api/purchaseService";

export const addPurchase =
    createAsyncThunk('purchase/addPurchase',async (body)=>{
        return  createPurchase(body.token,body
        ).then((res) =>{
            return res.data
        }).catch((err) =>{
            return err.response.data
        })
    })

export const fetchPurchase =
    createAsyncThunk('purchase/fetchPurchase',async (body)=>{
        return  getPurchaseByBuyer(
            body.token
        ).then((res) =>{
            return res.data
        }).catch((err) =>{
            return err.response.data
        })
    })

export const purchaseSlice = createSlice({
    name:"purchase",
    initialState:{
        purchaseList:[]
    },
    reducers:{

    },
    extraReducers:{
        [addPurchase.pending]:(state) => {
            console.log("Purchase Add pending")
        },
        [addPurchase.fulfilled]:(state,action) =>{
            if(action.payload.message ==="success"){
                toast.success('Order Placed ', {
                    position: toast.POSITION.TOP_CENTER
                });
            }else {
                toast.error('Please try again!!', {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        },
        [addPurchase.rejected]:(state)=>{
            toast.error("Purchase Create failed", {
                position: toast.POSITION.TOP_CENTER
            });
        },
        [fetchPurchase.pending]:(state) => {
            state.fetchPurchaseInProcess = true
            console.log("pending")
        },
        [fetchPurchase.fulfilled]:(state,action) =>{
            if(action.payload.message ==="success"){
                state.purchaseList = action.payload.data
                console.log("Purchase fetched")
            }else {
                console.log(action.payload.message)
            }
        },
        [fetchPurchase.rejected]:(state)=>{
            state.fetchPurchaseInProcess = false
            console.log("Purchase fetch failed")
        },
    }
})

export const purchaseReducer = purchaseSlice.reducer;