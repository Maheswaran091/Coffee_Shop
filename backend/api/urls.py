from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register),
    path('auth/login/', views.login_view),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/profile/', views.profile),

    # Menu
    path('categories/', views.categories),
    path('menu/', views.menu_items),
    path('menu/<int:pk>/', views.menu_item_detail),
    path('menu/<int:item_id>/reviews/', views.reviews),

    # Tables & Bookings
    path('tables/', views.tables),
    path('bookings/', views.bookings),
    path('bookings/<int:pk>/', views.booking_detail),

    # Orders
    path('orders/', views.orders),
    path('orders/<int:pk>/', views.order_detail),

    # Extras
    path('offers/', views.offers),
    path('contact/', views.contact),
    path('dashboard/stats/', views.dashboard_stats),
]
