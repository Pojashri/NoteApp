import axios from "axios";
import NotesList from "./components/NotesList";
import NoteForm from "./components/NoteForm";
import useConfirmDialog from "./Hooks/useConfirmDialog";
import React, { useState, useEffect, useRef } from "react";
import notesApi from "./CallApis/notesApi";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const noteFormRef = useRef(); 

  useEffect(() => {
    fetchNotes();
  }, []);

const fetchNotes = async () => {
    try {
      const res = await notesApi.getAllNotes();
      const sorted = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setNotes(sorted);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
};


const addNewNoteToList = (note, shouldRefresh = false) => {
    if (shouldRefresh) {
      fetchNotes();
      return;
    }
    setNotes((prevNotes) => [
      { ...note, date: new Date().toISOString().split("T")[0] },
      ...prevNotes,
    ]);
};


const { showConfirm, ConfirmDialog } = useConfirmDialog({
    message: "You have unsaved changes. Do you want to save first?",
    onConfirm: async () => {
      if (noteFormRef.current?.handleSave) {
        await noteFormRef.current.handleSave();
      }
    },
    onDiscard: () => {
      noteFormRef.current?.clearForm();
      setSelectedNote(null);
      setIsDirty(false);
    },
});


const handleNewNoteClick = () => {
  if (isDirty) {
    showConfirm(() => {
      setSelectedNote(null);
      noteFormRef.current.clearForm();
      setIsDirty(false);
    });
  } else {
    setSelectedNote(null);
    noteFormRef.current.clearForm();
    setIsDirty(false);
  }
};


const handleNoteClick = async (note) => {
  const isSameNote =
    selectedNote?.title === note.title &&
    selectedNote?.content === note.content;

  if (isDirty && !isSameNote) {
    showConfirm(() => {
      loadNote(note);
    });
  } else {
    loadNote(note);
  }
};


const loadNote = async (note) => {
  if (note.isProtected) {
    const password = prompt(`"${note.title}" is protected. Enter password:`);

    if (!password) return;

    try {
      const res = await notesApi.readNote(note.title, password);
      setSelectedNote({ title: note.title, content: res.data.content });
    } catch (err) {
      console.error("Unlock failed", err);
      alert("Incorrect password or failed to load note.");
      return;
    }
  } else {
    try {
      const res = await notesApi.readNote(note.title);
      setSelectedNote({ title: note.title, content: res.data.content });
    } catch (err) {
      console.error("Load failed", err);
      alert("Failed to load note.");
    }
  }

  setIsDirty(false);
};


const handleDeleteNote = async (note) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete "${note.title}"?`);
  if (!confirmDelete) return;

  try {
    // 👇 fileName = title (as you mentioned)
    await notesApi.deleteNote(note.title);

    setNotes(prev => prev.filter(n => n.title !== note.title));

    if (selectedNote?.title === note.title) {
      setSelectedNote(null);
    }

    alert("Note deleted.");
  } catch (err) {
    console.error("Delete failed", err);
    alert("Failed to delete note.");
  }
};


  return (
    <div className="flex h-screen bg-gray-100">
      <NotesList
        notes={notes}
        onNoteClick={handleNoteClick}
        onNewNote={handleNewNoteClick}
        confirmDialog={ConfirmDialog}  onDeleteNote={handleDeleteNote}
      />
      <NoteForm
        ref={noteFormRef}
        selectedNote={selectedNote}
        onNoteSaved={addNewNoteToList}
        onDirtyChange={setIsDirty}
      />
    </div>
  );
}

export default App;
