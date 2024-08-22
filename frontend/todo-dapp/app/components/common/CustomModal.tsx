import Modal from 'react-modal'

import '../../styles/modalStyles.css'

interface NetworkModalProps {
  isOpen: boolean
  onClose: () => void
  onButtonMethod: () => void
  modalTitle: string
  modalMsg: string
  buttonText: string
}

const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, onButtonMethod, modalTitle, modalMsg, buttonText }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Network Modal"
      className="modal-container"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <div className="modal-overlay">
        <div className="modal-inner-content">
          <button className="modal-close" onClick={onClose}>&times;</button>
          <div className="modal-content-container">
            <h2 className="modal-title">{ modalTitle }</h2>
            <p className="modal-message">{ modalMsg }</p>
            <button className="modal-button" onClick={onButtonMethod}>{ buttonText }</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NetworkModal