import React from "react";

interface ModalProps {
  id: string;
  title: string;
  content: React.ReactNode;
  onCloseText?: string;
}

const Modal: React.FC<ModalProps> = ({ id, title, content, onCloseText }) => {
  const closeModal = () => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box bg-[#ffffff] text-black dark:bg-[#181818] dark:text-white">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="py-4">{content}</div>
        <div className="modal-action">
          <form method="dialog">
            <button type="button" onClick={closeModal}>
              {onCloseText || "Close"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal; // Ensure there’s only one default export here
