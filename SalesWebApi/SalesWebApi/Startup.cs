using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.StaticFiles;
using Newtonsoft.Json.Serialization;
using Owin;
using SalesWebApi.DataAccess;
using SalesWebApi.DTO;
using SalesWebApi.Infrasctructure;
using SalesWebApi.Infrastructure;
using SalesWebApi.Models;
using SalesWebApi.Providers;
using Unity;

[assembly: OwinStartup(typeof(SalesWebApi.Startup))]

namespace SalesWebApi
{
    public partial class Startup
    {
        private static AutoMapper.IMapper _autoMapper;

        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit https://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
           // app.UseCookieAuthentication(new CookieAuthenticationOptions());
           // app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                // In production mode set AllowInsecureHttp = false
                //AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

        }
        private IUnityContainer CreateAndConfigreContainer()
        {
            var mapperConfiguration = new AutoMapper.MapperConfiguration(cfg => cfg.CreateMap<SalesRecord, SalesRecordDTO>());
            _autoMapper =  mapperConfiguration.CreateMapper();

            var container = new UnityContainer();
            container.RegisterInstance(_autoMapper);
            container.RegisterType<ApplicationDbContext, ApplicationDbContext>();
            container.RegisterType<ISalesRecordsDataService, SalesRecordsDataService>();
            return container;
        }

        private HttpConfiguration CreateHttpConfiguration()
        {
            var httpConfig = new HttpConfiguration
            {
                DependencyResolver = new UnityResolver(CreateAndConfigreContainer())
            };
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            httpConfig.SuppressDefaultHostAuthentication();
            httpConfig.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            httpConfig.MapHttpAttributeRoutes();
            httpConfig.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            httpConfig.Formatters.Remove(httpConfig.Formatters.XmlFormatter);
            httpConfig.Formatters.JsonFormatter.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
            var jsonFormatter = httpConfig.Formatters.JsonFormatter;
            jsonFormatter.UseDataContractJsonSerializer = false;
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            return httpConfig;
        }
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            app.UseStaticFiles();
            app.UseFileServer(new FileServerOptions
            {
                RequestPath = new PathString(string.Empty),
                FileSystem = new PhysicalFileSystem(@".\www")
            });

            app.UseWebApi(CreateHttpConfiguration());
        }
    }
}
