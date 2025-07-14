import React from "react";

const ConfirmDialog = ({ message, onConfirm, onDiscard, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{message}</h2>
        <div className="flex justify-end gap-3">
          <button onClick={onDiscard} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
            Discard
          </button>
          <button onClick={onConfirm} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
            Save
          </button>
          <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
