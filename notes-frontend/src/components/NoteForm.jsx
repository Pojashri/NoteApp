import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import notesApi from "../CallApis/notesApi";
import VoiceToTextButton from "./VoiceToTextButton";

const NoteForm = forwardRef(({ selectedNote, onNoteSaved, onDirtyChange }, ref) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [initialTitle, setInitialTitle] = useState("");
  const [initialContent, setInitialContent] = useState("");

  const isCreating = !selectedNote;

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setPassword(""); // Don't prefill password
      setInitialTitle(selectedNote.title);
      setInitialContent(selectedNote.content);
    } else {
      setTitle("");
      setContent("");
      setPassword("");
      setInitialTitle("");
      setInitialContent("");
    }
  }, [selectedNote]);

  useEffect(() => {
    const hasChanges = title !== initialTitle || content !== initialContent;
    onDirtyChange?.(hasChanges);
  }, [title, content, initialTitle, initialContent]);

  useImperativeHandle(ref, () => ({
    clearForm: () => {
      setTitle("");
      setContent("");
      setPassword("");
    },

    handleSave: async () => {
      try {
        if (selectedNote) {
          await notesApi.updateNote(selectedNote.title, { title, content, password });
          onNoteSaved(null, true);
        } else {
          await notesApi.createNote({ title, content, password });
          onNoteSaved({ title, content });
        }
        setTitle("");
        setContent("");
        setPassword("");
      } catch (err) {
        console.error("Failed to save/update note", err);
        alert("Something went wrong!");
      }
    },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ref.current?.handleSave) {
      await ref.current.handleSave();
    }
  };

  return (
    <div className="flex-1 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
        <input
          type="text"
          className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4 mt-2"
          rows="10"
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Show mic and password only when creating a new note */}
        {isCreating && (
          <>
            <VoiceToTextButton
              onTextGenerated={(text) => setContent(prev => prev + " " + text)}
            />
            <input
              type="password"
              className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4 mt-2"
              placeholder="Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full"
          >
            {isCreating ? "Save" : "Update"}
          </button>

          {!isCreating && (
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
                setPassword("");
              }}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

export default NoteForm;
