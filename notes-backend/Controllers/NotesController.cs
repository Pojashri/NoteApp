using Microsoft.AspNetCore.Mvc;
using NotesAPI.Services;
using NotesApp.Helper;
using NotesApp.Models;
using NotesApp.Services;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;


namespace NotesAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class NotesController    : ControllerBase
    {
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "Notes");
        private readonly INoteService _noteService;

        public NotesController(INoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpPost]
        public IActionResult SaveNote(NoteRequest request)
        {
            var filename = _noteService.SaveNote(request.Title, request.Content, request.password);

            var allFiles = Directory.GetFiles(_basePath, filename + ".txt", SearchOption.AllDirectories);



            return Ok(new { message = "Note saved!", file = filename });
        }

        [HttpGet("summary")]
        public IActionResult GetNotes()
        {
            var notes = _noteService.GetAllNotes();

            return Ok(notes);
        }

        [HttpGet("{fileName}")]
        public IActionResult ReadNote(string fileName, string password = "")
        {
            
            var matchingFiles = Directory.GetFiles(_basePath, fileName + ".txt", SearchOption.AllDirectories);

            if (matchingFiles.Length == 0)
                return NotFound("Note not found.");

            string filePath = matchingFiles[0]; 
            string metaPath = Path.ChangeExtension(filePath, ".meta.json");

            if (System.IO.File.Exists(metaPath))
            {
                var metaJson = System.IO.File.ReadAllText(metaPath);
                var metadata = JsonSerializer.Deserialize<NoteMetadata>(metaJson);

                if (metadata.IsProtected)
                {
                    if (string.IsNullOrEmpty(password))
                        return BadRequest("Password required.");

                    string incomingHash = PasswordHelper.HashPassword(password);

                    if (!string.Equals(incomingHash, metadata.PasswordHash, StringComparison.OrdinalIgnoreCase))
                        return Unauthorized("Incorrect password.");
                }
            }

            var content = System.IO.File.ReadAllText(filePath);
            return Ok(new { content });
        }

        [HttpGet("detailed")]
        public IActionResult GetAllNotes()
            {



            if (!Directory.Exists(_basePath))
                return Ok(new List<object>());

            var files = Directory.GetFiles(_basePath, "*", SearchOption.AllDirectories)
                     .Where(f => Path.GetExtension(f) == ".txt") // ✅ only note files
                     .ToList();

            var notes = files.Select(file =>
            {
                string content = System.IO.File.ReadAllText(file);

                string fileName = Path.GetFileNameWithoutExtension(file); 
                string folderName = Path.GetDirectoryName(file);        
                string dateFolder = new DirectoryInfo(folderName).Name;
                string metaPath = Path.ChangeExtension(file, ".meta.json");
                bool isProtected = false;

                if (System.IO.File.Exists(metaPath))
                {
                    string metaJson = System.IO.File.ReadAllText(metaPath);
                    var metadata = JsonSerializer.Deserialize<NoteMetadata>(metaJson);
                    isProtected = metadata?.IsProtected ?? false;
                }

                return new
                {
                    title = fileName,
                    content = content,
                    date = dateFolder,
                    IsProtected = isProtected
                };
            }).ToList();

            return Ok(notes);
        }


        [HttpPut("{*fileName}")]
        public IActionResult UpdateNote(string fileName, [FromBody] NoteRequest updatedNote)
        {
            var directPath = Path.Combine(_basePath, fileName + ".txt");

            if (System.IO.File.Exists(directPath))
            {
                System.IO.File.WriteAllText(directPath, updatedNote.Title + "\n" + updatedNote.Content);
                return Ok("Note updated in root folder.");
            }

            var allFiles = Directory.GetFiles(_basePath, fileName + ".txt", SearchOption.AllDirectories);

            if (allFiles.Length == 0)
                return NotFound("Note not found in any folder.");

            var foundPath = allFiles[0];
            if (!fileName.StartsWith(updatedNote.Title))
            {
                var newFileName = updatedNote.Title + Path.GetExtension(foundPath);
                var newPath = Path.Combine(Path.GetDirectoryName(foundPath), newFileName);
                System.IO.File.Move(foundPath, newPath); 
                foundPath = newPath; 
            }
            System.IO.File.WriteAllText(foundPath, updatedNote.Content);
            return Ok("Note updated successfully from subfolder.");
        }


        [HttpDelete("{fileName}")]
        public IActionResult DeleteNote(string fileName)
        {
            var filePaths = Directory.GetFiles(_basePath, fileName + ".txt", SearchOption.AllDirectories);

            if (filePaths.Length == 0) 
                return NotFound();

            foreach (var filePath in filePaths) 
            {
                System.IO.File.Delete(filePath);
            }

            return Ok("Deleted");
        }

    }
}
