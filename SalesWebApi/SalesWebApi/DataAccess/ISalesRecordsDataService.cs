using SalesWebApi.DTO;
using SalesWebApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesWebApi.DataAccess
{
    public interface ISalesRecordsDataService
    {
        Task<IEnumerable<SalesRecord>> GetAllRecords();
        Task Update(SalesRecord salesRecord);
        Task<Page<SalesRecordDTO>> GetPageAsync(uint page, uint pageSize, string searchText, bool orderDirection);
        Task DeleteAll();
        Task Delete(Guid id);
        Task BulkInsert(IEnumerable<SalesRecord> salesRecords);
    }
}