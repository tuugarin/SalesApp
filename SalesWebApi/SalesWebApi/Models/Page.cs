using System.Collections.Generic;

namespace SalesWebApi.Models
{
    public class Page<T>
    {
        public long Count { get; set; }

        public IEnumerable<T> List { get; set; }
    }
}