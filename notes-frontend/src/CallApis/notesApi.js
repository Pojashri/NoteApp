// src/api/notesApi.js
import axios from "axios";

const BASE_URL = "https://localhost:44358/api/notes";

const notesApi = {
  getAllNotes: () => axios.get(`${BASE_URL}/detailed`),
  createNote: (data) => axios.post(BASE_URL, data),
  updateNote: (fileName, data) => axios.put(`${BASE_URL}/${fileName}`, data),
readNote: (fileName, password = "") =>
  axios.get(`${BASE_URL}/${fileName}`, {
    params: { password }
  }),  deleteNote: (fileName) => axios.delete(`${BASE_URL}/${fileName}`), 
};

export default notesApi;
