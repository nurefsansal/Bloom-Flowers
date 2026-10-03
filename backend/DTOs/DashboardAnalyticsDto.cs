namespace backend.DTOs
{
    public class MonthlySalesDto
    {
        public string Month { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class OrderStatusCountDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class TopProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int TotalQuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class DashboardAnalyticsDto
    {
        public List<MonthlySalesDto> MonthlySales { get; set; } = new();

        public List<OrderStatusCountDto> OrderStatusBreakdown { get; set; } = new();

        public List<TopProductDto> TopProducts { get; set; } = new();
    }
}

