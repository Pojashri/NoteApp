namespace NotesApp.Models
{
    public class NoteRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
    }

    public class NoteMetadata
    {
        public bool IsProtected { get; set; }
        public string PasswordHash { get; set; } // store hashed password only
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
