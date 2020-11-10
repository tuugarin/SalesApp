using FastMember;
using SalesWebApi.DTO;
using SalesWebApi.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace SalesWebApi.DataAccess
{
    public class SalesRecordsDataService : ISalesRecordsDataService
    {
        ApplicationDbContext _dbContext;
        public SalesRecordsDataService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IEnumerable<SalesRecord>> GetAllRecords()
        {
            return await _dbContext.SalesRecords.AsNoTracking().ToListAsync();
        }

        public async Task Update(SalesRecord salesRecord)
        {
            _dbContext.SalesRecords.Attach(salesRecord);
            _dbContext.Entry(salesRecord).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }
        public async Task Delete(Guid id)
        {
            var record = new SalesRecord { ID = id };          
            _dbContext.SalesRecords.Attach(record);
            _dbContext.SalesRecords.Remove(record);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAll()
        {
            await _dbContext.Database.ExecuteSqlCommandAsync("Delete from SalesRecords");
        }

        public async Task<Page<SalesRecordDTO>> GetPageAsync(uint page, uint pageSize, string searchText, bool orderDirection)
        {
            if (searchText == null)
                searchText = "";

            SqlParameter SearchTextParam = new SqlParameter("@SearchText", searchText);

            SqlParameter pageParam = new SqlParameter("@page", (int)page);

            SqlParameter pageSizeParam = new SqlParameter("@pageSize", (int)pageSize);

            SqlParameter orderDirectionParam = new SqlParameter("@orderDirection", orderDirection);

            SqlParameter total = new SqlParameter
            {
                ParameterName = "total",
                Direction = ParameterDirection.Output,
                SqlDbType = SqlDbType.BigInt
            };
            IEnumerable<SalesRecordDTO> documentsList = await GetRangeFromStoredProcAsync<SalesRecordDTO>("GetSales @SearchText,@page,@pageSize,@orderDirection, @total out",
                SearchTextParam, pageParam, pageSizeParam, orderDirectionParam, total);
            return new Page<SalesRecordDTO> { List = documentsList, Count = (long)total.Value };
        }

        public async Task BulkInsert(IEnumerable<SalesRecord> salesRecords)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using(var transaction = connection.BeginTransaction())
                {
                    using (var sbCopy = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction))
                    {
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.ID), "ID");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.Region),"Region");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.Country), "Country");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.ItemType), "ItemType");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.SalesChanel), "SalesChanel");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.OrderPriority), "OrderPriority");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.OrderDate), "OrderDate");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.OrderId), "OrderId");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.ShipDate), "ShipDate");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.UnitsSold), "UnitsSold");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.UnitPrice), "UnitPrice");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.UnitCost), "UnitCost");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.TotalRevenue), "TotalRevenue");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.TotalCost), "TotalCost");
                        sbCopy.ColumnMappings.Add(nameof(SalesRecord.TotalProfit), "TotalProfit");

                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "SalesRecords";
                        using (var dataReader = ObjectReader.Create(salesRecords))
                        {
                            await sbCopy.WriteToServerAsync(dataReader);
                        }
                    }
                    transaction.Commit();
                }
            }
            
        }

        private async Task<IEnumerable<T>> GetRangeFromStoredProcAsync<T>(string sql, params object[] parameters)
        {
            var query = _dbContext.Database.SqlQuery<T>(sql, parameters);
            List<T> list = await query.ToListAsync();
            return list;
        }


    }
}