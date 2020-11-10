using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SalesWebApi.Models
{
    public class SalesRecord
    {
        [Key]
        public Guid ID { get; set; }

        public string Region { get; set; }

        public string Country { get; set; }
        
        public string ItemType { get; set; }

        public string SalesChanel { get; set; }

        public string OrderPriority { get; set; }

        public DateTime OrderDate { get; set; }

        public string OrderId { get; set; }

        public DateTime ShipDate { get; set; }

        public int UnitsSold { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal UnitCost { get; set; }

        public decimal TotalRevenue { get; set; }

        public decimal TotalCost { get; set; }

        public decimal TotalProfit { get; set; }

    }
}