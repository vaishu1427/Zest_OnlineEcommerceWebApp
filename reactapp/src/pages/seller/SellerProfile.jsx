import React, { useState, useEffect } from 'react';
import './SellerProfile.css';
import SellerNavigationBar from '../../components/seller/SellerNavigationBar';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/userSlice';
import { toast } from 'react-toastify';
import { MdKeyboardBackspace } from 'react-icons/md';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


export default function SellerProfile() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = useSelector((state) => state.user.token);
  const passwordValidation = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{5,}$')

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setPassword(currentUser.password || '');
      setPhoneNumber(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleGoBack = () => {
    navigate('/seller/home');
  };

  const handleSubmit = () => {
    const updatedUser = {
      firstName: firstname,
      lastName: lastname,
      password: password,
      phone: phonenumber,

    };

    if (Object.keys(updatedUser).some((key) => updatedUser[key] !== currentUser[key])) {
      if (passwordValidation.test(updatedUser.password)) {
        dispatch(updateUser({ token, id: currentUser.id, updatedUser }))
          .then(() => {
            toast.success('User updated successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
          })
          .catch(() => {
            toast.error('Failed to update user', {
              position: toast.POSITION.TOP_CENTER,
            });
          });
      } else {
        toast.error('Enter a valid password!', {
          position: toast.POSITION.TOP_CENTER
        });
      }
    } else {
      toast.info('No changes detected', {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    setEditable(false);
  };

  const handleEdit = () => {
    setEditable(true);
  };

  return (
    <div>
      <SellerNavigationBar />
      <div className="d-flex flex-row align-items-center">
        <p className="ms-3">
          <MdKeyboardBackspace style={{ color: 'grey' }} onClick={handleGoBack} />
          {' '}
          <a href="#" style={{ color: 'grey' }} onClick={handleGoBack}>
            Back
          </a>
        </p>
        <p className="ms-3" style={{ fontSize: 30 }}>
          <b>MY PROFILE</b>
        </p>
      </div>
      <br />
      <h4 style={{ paddingLeft: 100 }}>
        <b> Personal Information</b>
      </h4>
      <div className='mid'>
        <br />

        <h6> First Name </h6>
        <input
          className='form-control input'
          type='text'
          name='firstname'
          value={firstname}
          disabled={!editable}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />

        <h6>Last Name</h6>
        <input
          className='form-control input'
          type='text'
          name='lastname'
          value={lastname}
          disabled={!editable}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />

        <h6> Password</h6>
        <input
          className='form-control input'
          type='password'
          name='password'
          value={password}
          disabled={!editable}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <h6> Phone Number </h6>
        <input
          className='form-control input'
          type='phone'
          name='phone'
          value={phonenumber}
          disabled={!editable}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <br />

        <h6>
          {!editable ? (
            <button
              style={{ backgroundColor: '#F25151', color: 'black', width: '10%' }}
              className='btn btn-primary'
              onClick={handleEdit}
            >
              <b>Edit </b>
            </button>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 100px',
                columnGap: '20px',
              }}
            >
              <button
                style={{ backgroundColor: '#F25151', color: 'black' }}
                className='btn btn-primary'
                onClick={handleSubmit}
              >
                <b>Update</b>
              </button>
              <button
                className='btn btn-primary'
                style={{ backgroundColor: '#F25151', color: 'black' }}
                onClick={() => setEditable(false)}
              >
                <b>Cancel</b>
              </button>
            </div>
          )}
        </h6>
        <br />
      </div>
    </div>
  );
}
