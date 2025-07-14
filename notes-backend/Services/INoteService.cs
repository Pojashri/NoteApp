using System.Text;

namespace NotesApp.Services
{
    
        public interface INoteService
        {
            string SaveNote(string title, string content, string? password);
            IEnumerable<string> GetAllNotes();
            string ReadNote(string fileName);
        }
    

   

    }
