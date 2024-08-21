import Modal from 'react-modal'

import '../styles/networkModal.css'

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
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>&times;</button>
          <div className="modal-container">
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