import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserService, loginUserService, disabledUserById, getAllUser, updateUserById, sendVerificationSecurityCodeForFP, verifySecurityCodeForFP, updatePasswordForFP } from "../api/userService";
import { toast } from "react-toastify";

export const loginUser =
    createAsyncThunk('user/loginUser', async (body) => {
        return loginUserService(body.email, body.password)
            .then((res) => {
                console.log(res)
                return res.data
            }).catch((err) => {
                console.log(err)
                return err.data
            })
    })

export const signupUser =
    createAsyncThunk('user/signupUser', async (body) => {
        return createUserService(body.firstName, body.lastName, body.email, body.password, body.phone, body.roles, body.gender)
            .then((res) => {
                console.log(res.data)
                return res.data
            }).catch((err) => {
                console.log(err)
                return err.data
            })
    })

export const fetchAllUsers =
    createAsyncThunk('user/fetchAllUsers', async (body) => {
        return getAllUser(
            body.token
        ).then((res) => {
            return res.data
        }).catch((err) => {
            return err.data
        })
    })

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ token, id, updatedUser }) => {
        try {
            const response = await updateUserById(token, id, updatedUser);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const disableBuyer = createAsyncThunk(
    'user/disableBuyer',
    async ({ token, id }) => {
        try {
            const response = await disabledUserById(token, id);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const disableUser =
    createAsyncThunk('user/deleteUser', async (body) => {
        return disabledUserById(
            body.token,
            body.userId
        ).then((res) => {
            return res.data
        }).catch((err) => {
            return err.data
        })
    })

export const sendVerificationCodeForFP =
    createAsyncThunk('user/sendVerificationCodeForFP', async (body) => {
        return sendVerificationSecurityCodeForFP(
            body.email
        ).then((res) => {
            console.log(res)
            return res.data
        }).catch((error) => {
            console.log(error)
            return error.data
        })
    })

export const verifySecurityCode =
    createAsyncThunk('user/verifySecurityCode', async (body) => {
        return verifySecurityCodeForFP(
            body.email,
            body.securityCode
        ).then((res) => {
            console.log(res)
            return res.data
        }).catch((error) => {
            console.log(error)
            return error.data
        })
    })

export const updatePassword =
    createAsyncThunk('user/updatePassword', async ({ password, email }) => {
        try {
            const response = await updatePasswordForFP(password, email);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.data;
        }
    })

export const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            roles: '',
            id: ''
        },
        token: null,
        signupInProgress: false,
        signinInProgress: false,
        signinSuccess: false,
        signupSuccess: false,
        fetchUserInProcess: false,
        verifyingSecuritycode: false,
        forgotPasswordInProgress: false,
        allUserList: [],
        allActionList: [],
        selectedUser: ''
    },
    reducers: {
        signup: (state, actions) => {
            console.log(actions.payload)

        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload.id
        },
    },
    extraReducers: {
        [loginUser.pending]: (state) => {
            state.signinInProgress = true
            console.log("pending")
        },
        [loginUser.fulfilled]: (state, action) => {
            state.signinInProgress = false
            console.log("Fulfilled")
            console.log(action)
            if (action.payload !== undefined) {
                if (action.payload.message === "success") {
                    state.token = action.payload.data.token
                    state.currentUser.firstName = action.payload.data.currentUser.firstName
                    state.currentUser.lastName = action.payload.data.currentUser.lastName
                    state.currentUser.email = action.payload.data.currentUser.email
                    state.currentUser.phone = action.payload.data.currentUser.phone
                    state.currentUser.roles = action.payload.data.currentUser.roles
                    state.currentUser.id = action.payload.data.currentUser.id
                    state.signinSuccess = true
                } else {
                    toast.error(action.payload.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            } else {
                toast.error("Try again after sometime", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        },
        [loginUser.rejected]: (state) => {
            console.log("login  failed")
            alert("login failed,Try again")
            state.signinInProgress = false
        },
        [signupUser.pending]: (state) => {
            console.log("pending")
            state.signupInProgress = true
        },
        [signupUser.fulfilled]: (state, action) => {
            console.log("Fulfilled")
            state.signupInProgress = false
            if (action.payload !== undefined) {
                if (action.payload.message === "success") {
                    state.signupSuccess = true
                    toast('Account Created Successfully', {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    toast.error(action.payload.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    //alert(action.payload.message)
                }
            } else {
                toast.error("Try again after sometime", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        },
        [signupUser.rejected]: (state) => {
            console.log("signup  failed")
            alert("login failed,Try again")
            state.signupInProgress = false
        },
        [fetchAllUsers.pending]: (state) => {
            state.fetchUserInProcess = true
            console.log("pending")
        },
        [fetchAllUsers.fulfilled]: (state, action) => {
            if (action.payload) {
                state.allUserList = action.payload
                console.log("Users fetched")
                console.log(state.allUserList)
            } else {
                console.log("User Not fetched")
            }
            state.fetchUserInProcess = false
        },
        [fetchAllUsers.rejected]: (state) => {
            state.fetchUserInProcess = false
            console.log("Users fetch failed")
        },
        [updateUser.fulfilled]: (state, action) => {
            state.currentUser.firstName = action.payload.firstName
            state.currentUser.lastName = action.payload.lastName
            state.currentUser.email = action.payload.email
            state.currentUser.phone = action.payload.phone
            state.userDetails = action.payload;
        },
        [disableUser.pending]: (state) => {
            console.log("pending")
        },
        [disableUser.fulfilled]: (state, action) => {
            if (action.payload !== undefined) {
                if (action.payload.message === "success") {
                    console.log("User disabled")
                } else {
                    console.log(action.payload)
                }
            } else {
                toast.error("Try again after sometime", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        },
        [disableUser.rejected]: (state) => {
            console.log("User disabled failed")
            alert("Try again after some time")
        },
        [sendVerificationCodeForFP.pending]: (state) => {
            state.forgotPasswordInProgress = true
            console.log("pending")
        },
        [sendVerificationCodeForFP.fulfilled]: (state, action) => {
            state.forgotPasswordInProgress = false
            if (action.payload !== undefined) {
                if (action.payload.message === "success") {
                    toast.success('Verification code sent', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    console.log(action.payload.message)
                    toast.error(action.payload.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }
            else {
                toast.error("Try again after sometime", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        },
        [sendVerificationCodeForFP.rejected]: (state) => {
            state.forgotPasswordInProgress = false

            toast.error('Please try again', {
                position: toast.POSITION.TOP_RIGHT
            });

        },
        [verifySecurityCode.pending]: (state) => {
            state.verifyingSecuritycode = true;
            console.log("pending")
        },
        [verifySecurityCode.fulfilled]: (state, action) => {
            console.log("Fulfilled")
            if (action.payload !== undefined) {
                console.log("Fulfilled 1")
                console.log(action.payload.message)
                console.log(action.payload.message)
                state.verifyingSecuritycode = false;
                if (action.payload.message === "success") {
                    state.verifyingSecuritycode = true;
                    console.log(state.verifyingSecuritycode);
                    console.log("Fulfilled 2")
                    console.log(action.payload.message)
                    toast.success("Code verified successfully", {
                        position: toast.POSITION.TOP_RIGHT
                    });

                } else {
                    console.log(action.payload.message)
                    toast.error(action.payload.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }
            else {
                state.verifyingSecuritycode = false;
                toast.error("Try again after sometime", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        },
        [verifySecurityCode.rejected]: (state) => {
            state.signupInProgress = false
            state.forgotPasswordInProgress = false
            console.log("Rejected")
            toast.error("Try again after sometime", {
                position: toast.POSITION.TOP_CENTER
            });
        },
        [updatePassword.pending]: (state) => {
            console.log("pending")
        },
        [updatePassword.fulfilled]: (state, action) => {
            console.log("Fulfilled")
            if (action.payload !== undefined) {
                console.log("Fulfilled 1")
                console.log(action.payload.message)
                console.log(action.payload.message)
                if (action.payload.message === "success") {
                    console.log("Fulfilled 2")
                    console.log(action.payload.message)
                    toast.success("Password updated successfully", {
                        position: toast.POSITION.TOP_RIGHT
                    });

                } else {
                    console.log(action.payload.message)
                    toast.error(action.payload.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }
            else {
                toast.error("Try again after sometime", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        },
        [updatePassword.rejected]: (state) => {
            console.log("Rejected")
            toast.error("Try again after sometime", {
                position: toast.POSITION.TOP_CENTER
            });
        }

    }
})


export const { signup } = userSlice.actions

export const userReducer = userSlice.reducer


