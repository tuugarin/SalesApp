namespace SalesWebApi.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using SalesWebApi.Infrasctructure;
    using SalesWebApi.Models;
    using System.Data.Entity.Migrations;
    using System.IO;

    internal sealed class Configuration : DbMigrationsConfiguration<SalesWebApi.DataAccess.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SalesWebApi.DataAccess.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.
            var createStoredProcedureSql = File.ReadAllText("../DataAccess/SqlScripts/GetSales.sql");
            context.Database.ExecuteSqlCommand(createStoredProcedureSql);
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context));
            if(manager.Find("admin", "admin1") == null)
                manager.Create(new ApplicationUser { UserName = "admin" }, "admin1");
        }
    }
}
