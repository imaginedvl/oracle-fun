using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Oracle.Web.Middlewares
{

    public class MemorySession : ISession
    {

        private string _id = Guid.NewGuid().ToString();
        private Dictionary<string, byte[]> _items = new Dictionary<string, byte[]>(StringComparer.OrdinalIgnoreCase);
        public bool IsAvailable => true;

        public string Id => _id;

        public IEnumerable<string> Keys => _items.Keys;

        public void Clear()
        {
            _items.Clear();
        }

        public Task CommitAsync(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task LoadAsync(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public void Remove(string key)
        {
            _items.Remove(key);
        }

        public void Set(string key, byte[] value)
        {
            _items[key] = value;
        }

        public bool TryGetValue(string key, out byte[] value)
        {
            return _items.TryGetValue(key, out value);
        }
    }

    public static class ISessionExtensions
    {

        public static string GetString(this ISession session, string key)
        {
            if(session.TryGetValue(key, out byte[] value))
            {
                return Encoding.UTF8.GetString(value);
            }
            else
            {
                return default(string);
            }
        }

        public static void SetString(this ISession session, string key, string value)
        {
            session.Set(key, Encoding.UTF8.GetBytes(value));
        }
    }

}
