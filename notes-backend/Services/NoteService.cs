using NotesApp.Models;
using NotesApp.Services;
using System.Text;
using System.Text.Json;
using NotesApp.Helper;

namespace NotesAPI.Services
{
    public class NoteService : INoteService
    {
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "Notes");
        
        public string SaveNote(string title, string content, string password = null)
        {
            string folderName = DateTime.Now.ToString("yyyy-MM-dd");
            string fullPath = Path.Combine(_basePath, folderName);

            if (!Directory.Exists(fullPath))
                Directory.CreateDirectory(fullPath);

            string safeTitle = string.Join("_", title.Split(Path.GetInvalidFileNameChars()));
            string fileName = $"{safeTitle}_{DateTime.Now.Ticks}.txt";
            string filePath = Path.Combine(fullPath, fileName);

            File.WriteAllText(filePath, content, Encoding.UTF8);

            var metadata = new NoteMetadata
            {
                IsProtected = !string.IsNullOrEmpty(password),
                PasswordHash = string.IsNullOrEmpty(password) ? null : PasswordHelper.HashPassword(password),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            string metaFilePath = Path.ChangeExtension(filePath, ".meta.json");
            string metaJson = JsonSerializer.Serialize(metadata, new JsonSerializerOptions { WriteIndented = true });

            File.WriteAllText(metaFilePath, metaJson, Encoding.UTF8);

            return fileName;
        }

        public IEnumerable<string> GetAllNotes()
        {
            if (!Directory.Exists(_basePath)) return Enumerable.Empty<string>();
                 

            return Directory.GetFiles(_basePath, "*.txt", SearchOption.AllDirectories);
        }

        public string ReadNote(string fileName)
        {
            string file = Directory.GetFiles(_basePath, fileName, SearchOption.AllDirectories).FirstOrDefault();
            return file != null ? File.ReadAllText(file) : "Note not found";
        }
    }
}
