import Modal from 'react-modal'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onSeeInEtherscan: () => void
}

const TxSuccessfulModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, onSeeInEtherscan }) => {
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
            <h2 className="modal-title">Transaction successful!</h2>
            <p className="modal-message">You can check this transaction&rsquo;s info on Etherscan</p>
            <button className="modal-button" onClick={onSeeInEtherscan}>See in Etherscan</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TxSuccessfulModal