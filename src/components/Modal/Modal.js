import React from "react";
import Modal from "react-modal";
import Loader from "./Loader";

import "./Modal.css";

const ExportModal = (props) => (
    <Modal
      isOpen={props.modalIsOpen}
      contentLabel="Export"
      className="Modal"
      ariaHideApp={false}
    >
      <h3 className="title">Exporting Tickets</h3>
      <div className="body"><img className="loader" alt="loader" src={Loader}/></div> 

    </Modal>
  );
  
  export default ExportModal;