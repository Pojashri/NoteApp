using System.Text;
using System.Security.Cryptography;

namespace NotesApp.Helper
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(password.Trim());
            byte[] hash = SHA256.HashData(bytes);
            return Convert.ToHexString(hash);
        }
    }
}
