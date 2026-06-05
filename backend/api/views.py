from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Sum
from .models import *
from .serializers import *
from decimal import Decimal


# ===================== AUTH =====================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        prof = request.user.profile
    except UserProfile.DoesNotExist:
        prof = UserProfile.objects.create(user=request.user)
    if request.method == 'GET':
        return Response(UserProfileSerializer(prof).data)
    serializer = UserProfileSerializer(prof, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


# ===================== MENU =====================

@api_view(['GET'])
@permission_classes([AllowAny])
def categories(request):
    cats = Category.objects.all()
    return Response(CategorySerializer(cats, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def menu_items(request):
    items = MenuItem.objects.filter(is_available=True).select_related('category')
    category = request.GET.get('category')
    search = request.GET.get('search')
    featured = request.GET.get('featured')
    veg_only = request.GET.get('veg')
    if category:
        items = items.filter(category__slug=category)
    if search:
        items = items.filter(Q(name__icontains=search) | Q(description__icontains=search))
    if featured:
        items = items.filter(is_featured=True)
    if veg_only:
        items = items.filter(is_veg=True)
    return Response(MenuItemSerializer(items, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def menu_item_detail(request, pk):
    try:
        item = MenuItem.objects.get(pk=pk)
        return Response(MenuItemSerializer(item).data)
    except MenuItem.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)


# ===================== TABLES =====================

@api_view(['GET'])
@permission_classes([AllowAny])
def tables(request):
    tbls = Table.objects.all()
    return Response(TableSerializer(tbls, many=True).data)


# ===================== BOOKINGS =====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bookings(request):
    if request.method == 'GET':
        bks = DeskBooking.objects.filter(user=request.user).order_by('-created_at')
        return Response(DeskBookingSerializer(bks, many=True).data)

    # POST - create booking
    data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)

    serializer = DeskBookingSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

    print("Booking errors:", serializer.errors)  # debug
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def booking_detail(request, pk):
    try:
        booking = DeskBooking.objects.get(pk=pk, user=request.user)
    except DeskBooking.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    if request.method == 'GET':
        return Response(DeskBookingSerializer(booking).data)
    if request.method == 'PUT':
        serializer = DeskBookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    booking.status = 'cancelled'
    booking.save()
    return Response({'message': 'Booking cancelled successfully'})


# ===================== ORDERS =====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def orders(request):
    if request.method == 'GET':
        ords = Order.objects.filter(user=request.user).prefetch_related('items__menu_item').order_by('-created_at')
        return Response(OrderSerializer(ords, many=True).data)

    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data
    order = Order.objects.create(
        user=request.user,
        order_type=data['order_type'],
        table_id=data.get('table_id'),
        delivery_address=data.get('delivery_address', ''),
        special_instructions=data.get('special_instructions', ''),
        payment_method=data.get('payment_method', 'cash'),
    )
    total = Decimal('0')
    for item_data in data['items']:
        try:
            menu_item = MenuItem.objects.get(id=item_data['menu_item_id'])
        except MenuItem.DoesNotExist:
            continue
        qty = int(item_data.get('quantity', 1))
        oi = OrderItem.objects.create(
            order=order, menu_item=menu_item, quantity=qty,
            unit_price=menu_item.price, size=item_data.get('size', 'M'),
            customization=item_data.get('customization', ''),
        )
        total += oi.subtotal

    tax = total * Decimal('0.05')
    order.total_amount = total + tax
    order.tax = tax
    order.status = 'confirmed'
    order.save()
    return Response(OrderSerializer(order).data, status=201)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    if request.method == 'GET':
        return Response(OrderSerializer(order).data)
    if request.data.get('status') == 'cancelled' and order.status in ['pending', 'confirmed']:
        order.status = 'cancelled'
        order.save()
        return Response(OrderSerializer(order).data)
    return Response({'error': 'Cannot update this order'}, status=400)


# ===================== REVIEWS =====================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def reviews(request, item_id):
    if request.method == 'GET':
        revs = Review.objects.filter(menu_item_id=item_id).select_related('user')
        return Response(ReviewSerializer(revs, many=True).data)
    if not request.user.is_authenticated:
        return Response({'error': 'Login required'}, status=401)
    data = {**request.data, 'menu_item': item_id}
    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user, menu_item_id=item_id)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ===================== OFFERS =====================

@api_view(['GET'])
@permission_classes([AllowAny])
def offers(request):
    from django.utils import timezone
    now = timezone.now()
    offs = Offer.objects.filter(is_active=True, valid_from__lte=now, valid_until__gte=now)
    return Response(OfferSerializer(offs, many=True).data)


# ===================== CONTACT =====================

@api_view(['POST'])
@permission_classes([AllowAny])
def contact(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Message sent successfully!'})
    return Response(serializer.errors, status=400)


# ===================== DASHBOARD =====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    if not request.user.is_staff:
        return Response({'error': 'Forbidden'}, status=403)
    from django.utils import timezone
    today = timezone.now().date()
    stats = {
        'total_orders': Order.objects.count(),
        'today_orders': Order.objects.filter(created_at__date=today).count(),
        'total_revenue': float(Order.objects.filter(status='delivered').aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
        'today_revenue': float(Order.objects.filter(created_at__date=today).aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
        'total_customers': User.objects.filter(is_staff=False).count(),
        'total_bookings': DeskBooking.objects.count(),
        'today_bookings': DeskBooking.objects.filter(booking_date=today).count(),
        'menu_items': MenuItem.objects.filter(is_available=True).count(),
    }
    return Response(stats)
