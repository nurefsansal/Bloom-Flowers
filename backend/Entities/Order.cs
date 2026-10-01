namespace backend.Entities
{
    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Preparing,
        OutForDelivery,
        Delivered,
        Cancelled
    }

    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? AddressId { get; set; }
        public Address? Address { get; set; }

        // Adres snapshot alanları (Final MVP Scope madde 3)
        public string DeliveryCity { get; set; } = string.Empty;
        public string DeliveryDistrict { get; set; } = string.Empty;
        public string DeliveryFullAddress { get; set; } = string.Empty;
        public string DeliveryPhoneNumber { get; set; } = string.Empty;

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public DateOnly DeliveryDate { get; set; }
        public string DeliveryTimeSlot { get; set; } = string.Empty;
        public string? OrderNote { get; set; }

        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}