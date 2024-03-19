import Modal from "react-bootstrap/Modal";

const ModalComponent = (props) => {
  return (
    <Modal
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      size={props?.size ? props?.size : "xl"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={
        {
          // zIndex: 999999999999,
        }
      }
    >
      <Modal.Header closeButton>
        <h5 className="modal-title" id="exampleModalLabel" style={{textTransform:"capitalize"}}>
          {/* Complete Profile */}
          {props?.heading}
        </h5>
      </Modal.Header>
      <Modal.Body className="flex align-items-center jusitify-content-center">{props.children}</Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
