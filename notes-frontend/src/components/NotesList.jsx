import React from "react";
import { Trash2, Lock } from "lucide-react"; // Lucide lock

const NotesList = ({ notes = [], onNoteClick, onNewNote, confirmDialog, onDeleteNote }) => {
  return (
    <div className="w-64 bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full w-full"
          onClick={onNewNote}
        >
          <i className="fas fa-plus mr-2"></i> New Note
        </button>
      </div>

      <ul className="divide-y divide-gray-200 overflow-y-auto h-[calc(100vh-80px)] px-1">
        {notes.map((note, index) => (
          <li
            key={index}
            className="py-3 px-3 hover:bg-gray-100 flex flex-col cursor-pointer rounded-lg"
            onClick={() => onNoteClick(note)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 w-[140px] overflow-hidden">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {note.title}
                </span>
                {note.isProtected && (
                  <Lock className="w-4 h-4 text-orange-500" />
                )}
              </div>

              <span className="text-xs text-gray-400 ml-1">
                {note.date || "—"}
              </span>

              <button
                className="text-red-500 hover:text-red-700 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note);
                }}
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {confirmDialog && confirmDialog}
    </div>
  );
};

export default NotesList;
