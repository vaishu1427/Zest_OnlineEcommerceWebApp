import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../features/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import { fetchProductsBySellerId } from '../../features/productSlice';
import { fetchPurchaseById } from '../../features/purchaseSlice';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/common/Footer';
import AdminNavigationBar from '../../components/admin/AdminNavigationBar';
import DisableModal from '../../components/admin/DisableModal';
import { useNavigate } from 'react-router-dom';

export default function Showuser() {
  const navigate = useNavigate();
  const token = useSelector(state => state.user.token);
  const allUserList = useSelector(state => state.user.allUserList);
  const purchaseListById = useSelector(state => state.purchase.purchaseListById);
  const productListById = useSelector(state => state.product.productListById);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [status, setStatus] = useState('');

  const handleAction = (userId, enabled) => {
    setStatus(enabled);
    setSelectedUser(userId)
    setShowDisableModal(true)
  };
  const handleHideRemoveModal = () => setShowDisableModal(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers({ token: token }));
  }, [token]);

  const handleorders = (e, id) => {
    console.log(id)
    dispatch(fetchPurchaseById({ userid: id }));

  };

  const handleproducts = (e, id) => {
    console.log(id)
    dispatch(fetchProductsBySellerId({ token: token, userid: id }));
  };

  const handleGotoClick = () => {
    navigate("/admin/products");
  };


  return (
    <div>
      <AdminNavigationBar />
      <div className="d-flex justify-content-between">
        <h3 style={{ marginLeft: 10, marginTop: 8 }}><b>USERS</b></h3>
        <button type="button" onClick={handleGotoClick} class="btn btn-primary" style={{ margin: "8px 10px", backgroundColor: "#B6D3FF", color: "black" }}><b>Go to products</b></button>
      </div>

      <br></br>
      <div style={{ padding: "0px 50px 50px 50px" }}>
        <Table>
          <thead>
            <tr>
              <th className='text-secondary'>NAME</th>
              <th className='text-secondary'>EMAIL</th>
              <th className='text-secondary'>PHONE NUMBER</th>
              <th className='text-secondary'>DATE JOINED</th>
              <th className='text-secondary'>TYPE</th>
              <th className='text-secondary'> </th>
              <th className='text-secondary'> </th>
            </tr>
          </thead>
          <tbody>
            {allUserList.map(({ id, firstName, email, phone, createdAt, roles, enabled }) => (
              <tr key={id}>
                <td>{firstName}</td>
                <td>{email}</td>
                <td>{phone}</td>
                <td>{createdAt ? createdAt.slice(0, 10) : ""}</td>
                <td>{roles.slice(5)}</td>
                <td key={id}>
                  <div key={id}>
                    <div>
                      {roles === "ROLE_BUYER" && (
                        <div>
                          <button style={{ color: "black" }}
                            key={id}
                            onClick={(e) => { handleorders(e, id) }}
                            className="btn btn-warning"
                            data-toggle="modal" data-target="#exampleModalorder">
                            <b>Orders</b>
                          </button>

                          <div class="modal fade" id="exampleModalorder" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div style={{ maxWidth: "580px" }} class="modal-dialog modal-dialog-centered" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLongTitle"><b>ORDERS</b></h5>
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body">
                                  <div>
                                    <Table >
                                      <thead>
                                        <tr>
                                          <th style={{ borderTop: "0" }} className=' text-secondary'>NAME</th>
                                          <th style={{ borderTop: "0", textAlign: "center" }} className='text-secondary'>COUNT</th>
                                          <th style={{ borderTop: "0" }} className='text-secondary'>DATE OF PURCHASE</th>
                                          <th style={{ borderTop: "0" }} className='text-secondary'>MODE OF TRANSACTION</th>

                                        </tr>
                                      </thead>
                                      <tbody>
                                        {purchaseListById.map(({ id, product, quantity, purchaseDate, paymentMethod }) => (
                                          <tr key={id}>
                                            <td style={{ textAlign: "center" }} className='text-secondary'>{product.name}</td>
                                            <td style={{ textAlign: "center" }} className='text-secondary'>{quantity}</td>
                                            <td style={{ textAlign: "center" }} className='text-secondary'>{purchaseDate ? purchaseDate.slice(0, 10) : ""}</td>
                                            <td style={{ textAlign: "center" }} className='text-secondary'>{paymentMethod}</td>

                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      {roles === "ROLE_SELLER" && (
                        <div>
                          <button style={{ color: "black" }}
                            key={id}
                            onClick={(e) => { handleproducts(e, id) }}
                            className="btn btn-info"
                            data-toggle="modal" data-target="#exampleModalproduct"
                          ><b>Products</b></button>
                          <div class="modal fade" id="exampleModalproduct" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div style={{ maxWidth: "904px" }} class="modal-dialog modal-dialog-centered" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLongTitle"><b>PRODUCTS</b></h5>
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body">
                                  <div>
                                    <Table>
                                      <thead>
                                        <tr>
                                          <th style={{ borderTop: "0", width: '50%', textAlign: 'center' }} className='text-secondary'>NAME</th>
                                          <th style={{ borderTop: "0", textAlign: 'center' }} className='text-secondary'>COUNT</th>
                                          <th style={{ borderTop: "0", textAlign: 'center' }} className='text-secondary'>DATE ADDED</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {productListById.map(({ id, name, quantity, createdAt }) => (
                                          <tr key={id}>
                                            <td style={{ textAlign: "center" }} className='text-secondary'>{name}</td>
                                            <td style={{ textAlign: "center" }} className='text-secondary'>{quantity}</td>
                                            <td style={{ textAlign: "center" }} className='text-secondary'>{createdAt ? createdAt.slice(0, 10) : ""}</td>

                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td>
                  <button style={{ color: "black" }}
                    key={id}
                    className="btn btn-primary"
                    class="btn btn-danger" data-toggle="modal" data-target="#exampleModalactions"
                    onClick={() => handleAction(id, enabled)}
                  >
                    <b>Actions</b>
                  </button>
                </td>

                <div>
                  <ToastContainer />
                </div>
              </tr>
            ))}
          </tbody>
          <DisableModal enableStatus={status} userId={selectedUser} show={showDisableModal} handleHideRemoveModal={handleHideRemoveModal}></DisableModal>
        </Table>
      </div>
      <Footer />
    </div >
  );
}


