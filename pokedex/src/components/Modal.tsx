export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div>
      <button onClick={onClose}>X</button>
      {children}
    </div>
  );
}
