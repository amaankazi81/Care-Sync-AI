using System.Security.Cryptography;
using System.Text;

namespace CareSync.BusinessAPI.Helpers;

public class EncryptionHelper
{
    private readonly IConfiguration _configuration;

    public EncryptionHelper(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string Encrypt(string plainText)
    {
        var key = Encoding.UTF8.GetBytes(
            _configuration["Encryption:Key"]!);

        var iv = Encoding.UTF8.GetBytes(
            _configuration["Encryption:IV"]!);

        using Aes aes = Aes.Create();

        aes.Key = key;

        aes.IV = iv;

        using MemoryStream ms = new();

        using CryptoStream cs =
            new(
                ms,
                aes.CreateEncryptor(),
                CryptoStreamMode.Write);

        using (StreamWriter sw = new(cs))
        {
            sw.Write(plainText);
        }

        return Convert.ToBase64String(
            ms.ToArray());
    }

    public string Decrypt(string cipherText)
    {
        var key = Encoding.UTF8.GetBytes(
            _configuration["Encryption:Key"]!);

        var iv = Encoding.UTF8.GetBytes(
            _configuration["Encryption:IV"]!);

        using Aes aes = Aes.Create();

        aes.Key = key;

        aes.IV = iv;

        using MemoryStream ms =
            new(Convert.FromBase64String(cipherText));

        using CryptoStream cs =
            new(
                ms,
                aes.CreateDecryptor(),
                CryptoStreamMode.Read);

        using StreamReader sr =
            new(cs);

        return sr.ReadToEnd();
    }
}