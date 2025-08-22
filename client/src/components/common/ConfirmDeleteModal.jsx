import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ConfirmDeleteModal({
  open,
  title = "Delete account",
  message = "This action is permanent. You will lose all data associated with your account.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal show={open} size="md" popup onClose={loading ? undefined : onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mb-6 text-sm text-gray-600">{message}</p>
          <div className="flex justify-center gap-3">
            <Button color="failure" onClick={onConfirm} isProcessing={loading} disabled={loading}>
              {confirmText}
            </Button>
            <Button color="gray" onClick={onClose} disabled={loading}>
              {cancelText}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
