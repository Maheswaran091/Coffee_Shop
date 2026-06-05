from django.contrib import admin
from .models import *


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon']


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available', 'is_featured', 'rating']
    list_filter = ['category', 'is_available', 'is_featured', 'is_veg']
    search_fields = ['name', 'description']
    list_editable = ['is_available', 'is_featured']


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['table_number', 'capacity', 'location', 'status']
    list_editable = ['status']


@admin.register(DeskBooking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'table', 'booking_date', 'start_time', 'end_time', 'status']
    list_filter = ['status', 'booking_date']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'order_type', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'order_type']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'menu_item', 'quantity', 'unit_price', 'subtotal']


@admin.register(UserProfile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'loyalty_points']


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'code', 'discount_percent', 'is_active', 'valid_until']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'menu_item', 'rating', 'created_at']


@admin.register(ContactMessage)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_editable = ['is_read']
