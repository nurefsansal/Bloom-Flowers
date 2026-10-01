namespace backend.DTOs
{
    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateOrderDto
    {
        public int AddressId { get; set; }
        public DateOnly DeliveryDate { get; set; }
        public string DeliveryTimeSlot { get; set; } = string.Empty;
        public string? OrderNote { get; set; }
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}