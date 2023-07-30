import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from "react-redux";
import { disableUser, fetchAllUsers } from '../../features/userSlice';


export default function DeleteDisableModal(props) {
    const token = useSelector(state => state.user.token)
    const dispatch = useDispatch()
    console.log(props.userId)
    console.log(props.enableStatus);

    async function handleDisableUser() {
        await dispatch(disableUser({ token: token, userId: props.userId }))
        await dispatch(fetchAllUsers({ token: token }))
        console.log("User disabled successfully")
        console.log(props.enableStatus);
        props.handleHideRemoveModal()
    }

    return (
        <Modal show={props.show} onHide={props.handleHideRemoveModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Choose one of the options</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleHideRemoveModal}>
                    Cancel
                </Button>
                {props.enableStatus === true ? (
                    <Button variant="primary" style={{ backgroundColor: "#F25151" }} onClick={() => handleDisableUser()}>
                        Disable
                    </Button>
                ) : (
                    <Button variant="primary" style={{ backgroundColor: "#F25151" }} onClick={() => handleDisableUser()}>
                        Enable
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}