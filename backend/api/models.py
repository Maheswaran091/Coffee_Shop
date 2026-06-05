from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    CATEGORY_CHOICES = [
        ('coffee', 'Coffee'), ('cookies', 'Cookies'), ('cakes', 'Cakes'),
        ('biscuits', 'Biscuits'), ('snacks', 'Snacks'), ('beverages', 'Beverages'),
    ]
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, default='coffee')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class MenuItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image_url = models.URLField(blank=True, default='')
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_veg = models.BooleanField(default=True)
    calories = models.IntegerField(default=0)
    preparation_time = models.IntegerField(default=5, help_text='Minutes')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    review_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Table(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'), ('occupied', 'Occupied'),
        ('reserved', 'Reserved'), ('maintenance', 'Maintenance'),
    ]
    table_number = models.IntegerField(unique=True)
    capacity = models.IntegerField(default=2)
    location = models.CharField(max_length=100, default='Indoor')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    has_power_outlet = models.BooleanField(default=False)
    has_window_view = models.BooleanField(default=False)

    def __str__(self):
        return f"Table {self.table_number}"


class DeskBooking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'), ('completed', 'Completed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    number_of_guests = models.IntegerField(default=1)
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking by {self.user.username} on {self.booking_date}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('confirmed', 'Confirmed'), ('preparing', 'Preparing'),
        ('ready', 'Ready'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled'),
    ]
    ORDER_TYPE_CHOICES = [
        ('dine_in', 'Dine In'), ('takeaway', 'Takeaway'), ('delivery', 'Delivery'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True)
    order_type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES, default='dine_in')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_address = models.TextField(blank=True)
    special_instructions = models.TextField(blank=True)
    payment_method = models.CharField(max_length=50, default='cash')
    payment_status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    size = models.CharField(max_length=1, default='M')
    customization = models.TextField(blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.subtotal = self.unit_price * self.quantity
        super().save(*args, **kwargs)


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'menu_item')


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    loyalty_points = models.IntegerField(default=0)
    avatar = models.URLField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Offer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount_percent = models.IntegerField(default=0)
    code = models.CharField(max_length=20, unique=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    min_order_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
