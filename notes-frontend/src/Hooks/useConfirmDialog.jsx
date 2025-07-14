import React, { useState } from "react";

function useConfirmDialog({ message, onConfirm, onDiscard }) {
  const [isOpen, setIsOpen] = useState(false);
  const [nextAction, setNextAction] = useState(null);

  const showConfirm = (callbackIfConfirmed) => {
    setIsOpen(true);
    setNextAction(() => callbackIfConfirmed);
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    await onConfirm();
    if (nextAction) nextAction();
  };

  const handleDiscard = () => {
    setIsOpen(false);
    onDiscard();
    if (nextAction) nextAction();
  };

  const ConfirmDialog = isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-gray-800 text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleDiscard}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Discard
          </button>
          <button
            onClick={handleConfirm}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Save First
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { showConfirm, ConfirmDialog };
}

export default useConfirmDialog;
