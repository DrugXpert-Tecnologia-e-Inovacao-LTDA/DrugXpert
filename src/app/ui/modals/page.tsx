import React from "react";

// Define the ModalProps interface
interface ModalProps {
  id: string;          // Add the id prop
  title: string;      // Add the title prop
  content: React.ReactNode; // Content can be any valid React node
  onCloseText?: string; // Optional prop for close button text
}

const Modal: React.FC<ModalProps> = ({ id, title, content, onCloseText }) => {
  // Function to close the modal
  const closeModal = () => {
    const dialog = document.getElementById(id) as HTMLDialogElement; // Cast to HTMLDialogElement
    if (dialog) {
      dialog.close(); // Now TypeScript recognizes the close method
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
              {onCloseText || "Close"}  {/* Use the onCloseText prop or default to "Close" */}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
