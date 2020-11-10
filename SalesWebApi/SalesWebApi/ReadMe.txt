First of all, to run the project you should restore all nuget packages and also client packages (go to package.json -> right click -> Restore  Packages)
Then go to Web.config and change the connection string tou your SQL Server.
Next go to Package Manager Consol and run update-database command. It will roll up all migrationgs and preapre the database. (GetSales stored proc should be added at that time)
Build and run.
As a login and password please use admin admin1.

PS Things I have not covered. 
Did not managed to create unit tests, to minify all js files,css files and external modules.