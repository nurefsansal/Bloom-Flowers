namespace backend.DTOs
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }

        public DateOnly DeliveryDate { get; set; }
        public string DeliveryTimeSlot { get; set; } = string.Empty;

        public string? OrderNote { get; set; }

        public string DeliveryCity { get; set; } = string.Empty;
        public string DeliveryDistrict { get; set; } = string.Empty;
        public string DeliveryFullAddress { get; set; } = string.Empty;
        public string DeliveryPhoneNumber { get; set; } = string.Empty;

        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();
    }
}