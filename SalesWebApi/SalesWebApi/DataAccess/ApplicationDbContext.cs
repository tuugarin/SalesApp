using Microsoft.AspNet.Identity.EntityFramework;
using SalesWebApi.Models;
using System.Data.Entity;

namespace SalesWebApi.DataAccess
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<SalesRecord> SalesRecords { get; set; }
    }
}