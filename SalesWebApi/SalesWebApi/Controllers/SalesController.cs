using AutoMapper;
using SalesWebApi.DataAccess;
using SalesWebApi.DTO;
using SalesWebApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace SalesWebApi.Controllers
{
    [Authorize]
    public class SalesController : ApiController
    {
        ISalesRecordsDataService _salesRecordsDataService;
        IMapper _mapper;
        public SalesController(ISalesRecordsDataService salesRecordsDataService, IMapper mapper)
        {
            _salesRecordsDataService = salesRecordsDataService;
            _mapper = mapper;
        }

        // GET api/sales
        public async Task<IHttpActionResult> Get()
        {
            var records = await _salesRecordsDataService.GetAllRecords();
            var res = _mapper.Map<IEnumerable<SalesRecord>, IEnumerable<SalesRecordDTO>>(records);
            return Ok(res.ToList());
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(uint page, uint pageSize, bool orderDirection, string searchText = null)
        {

            try
            {
                var pageResult = await _salesRecordsDataService.GetPageAsync(page, pageSize, searchText, orderDirection);
                return Ok(pageResult);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // DELETE api/sales/5
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            await _salesRecordsDataService.Delete(id);
            return Ok();
        }

        // DELETE api/sales/5
        public async Task<IHttpActionResult> Delete()
        {
            await _salesRecordsDataService.DeleteAll();
            return Ok();
        }
        // POST api/sales/upload
        [HttpPost]
        public async Task<IHttpActionResult> Upload()
        {

            var provider = new MultipartMemoryStreamProvider();
            var result = await Request.Content.ReadAsMultipartAsync(provider);
            var stream = await result.Contents[0].ReadAsStreamAsync();

            List<SalesRecord> records = new List<SalesRecord>();
            
            using (var streamReader = new StreamReader(stream))
            {
                await streamReader.ReadLineAsync(); // skip headers
                while(!streamReader.EndOfStream)
                {
                    var arr = (await streamReader.ReadLineAsync()).Split(',');
                    if (arr.Length < 13)
                        return BadRequest("File is not supported");

                    var record = new SalesRecord
                    {
                        ID = Guid.NewGuid(),
                        Region = arr[0],
                        Country = arr[1],
                        ItemType = arr[2],
                        SalesChanel = arr[3],
                        OrderPriority = arr[4],
                        OrderDate = DateTime.Parse(arr[5]),
                        OrderId = arr[6],
                        ShipDate = DateTime.Parse(arr[7]),
                        UnitsSold = int.Parse(arr[8]),
                        UnitPrice = decimal.Parse(arr[9]),
                        UnitCost = decimal.Parse(arr[10]),
                        TotalRevenue = decimal.Parse(arr[11]),
                        TotalCost = decimal.Parse(arr[12]),
                        TotalProfit = decimal.Parse(arr[13])
                    };
                    records.Add(record);
                }
                await _salesRecordsDataService.BulkInsert(records);
            }

            return Ok();

        }
    }
}
