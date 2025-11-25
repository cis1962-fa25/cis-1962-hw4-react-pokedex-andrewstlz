export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-body"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            float: "right",
            marginBottom: "10px",
            background: "#e63946",
            borderRadius: "6px",
          }}
          onClick={onClose}
        >
          X
        </button>

        {children}
      </div>
    </div>
  );
}
