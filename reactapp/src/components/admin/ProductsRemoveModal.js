import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useDispatch, useSelector} from "react-redux";
import {deleteProduct, fetchProduct} from "../../features/productSlice";


export default function ProductsRemoveModal(props) {
  const token = useSelector(state => state.user.token)
    const dispatch = useDispatch()
    async function handleDeleteProduct(){
      console.log(token)
        await dispatch(deleteProduct({ token: token, productId: props.productId }))
        await dispatch(fetchProduct({token:token}))
        console.log("product deleted")
        props.handleHideRemoveModal()
    }
  return (
    <Modal show={props.show} onHide={props.handleHideRemoveModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure to remove?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleHideRemoveModal}>
          No, Cancel
        </Button>
        <Button variant="primary" style={{backgroundColor:"#F25151"}} onClick={() => handleDeleteProduct()}>
          Yes, Remove
        </Button>
      </Modal.Footer>
    </Modal>
  )
}