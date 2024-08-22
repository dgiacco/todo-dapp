import Modal from 'react-modal'

import '../styles/modalStyles.css'

interface NetworkModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchNetwork: () => void
}

const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, onSwitchNetwork }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Network Modal"
      className="modal-container"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="modal-overlay">
        <div className="modal-inner-content">
          <button className="modal-close" onClick={onClose}>x</button>
          <div className="modal-content-container">
            <h2 className="modal-title">Network Switch Needed</h2>
            <p className="modal-message">You need to switch to the Sepolia network to continue.</p>
            <button className="modal-button" onClick={onSwitchNetwork}>Switch to Sepolia</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NetworkModal