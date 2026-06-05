from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_item_count(self, obj):
        return obj.items.filter(is_available=True).count()


class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = MenuItem
        fields = '__all__'


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'


class DeskBookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    table_detail = TableSerializer(source='table', read_only=True)

    # Accept table_id from frontend, map it to the 'table' FK
    table_id = serializers.IntegerField(write_only=True)

    booking_date = serializers.DateField()
    start_time   = serializers.TimeField()
    end_time     = serializers.TimeField()
    number_of_guests = serializers.IntegerField(min_value=1)
    special_requests = serializers.CharField(allow_blank=True, required=False, default='')

    class Meta:
        model  = DeskBooking
        fields = [
            'id', 'user', 'table_detail', 'table_id',
            'booking_date', 'start_time', 'end_time',
            'number_of_guests', 'special_requests', 'status', 'created_at',
        ]
        read_only_fields = ('id', 'user', 'status', 'created_at', 'table_detail')

    def validate(self, data):
        start = data.get('start_time')
        end   = data.get('end_time')
        if start and end and start >= end:
            raise serializers.ValidationError({'end_time': 'End time must be after start time.'})

        # Validate that the table exists
        table_id = data.get('table_id')
        if table_id:
            if not Table.objects.filter(id=table_id).exists():
                raise serializers.ValidationError({'table_id': f'Table with id {table_id} does not exist.'})
        return data

    def create(self, validated_data):
        table_id = validated_data.pop('table_id')
        table    = Table.objects.get(id=table_id)
        return DeskBooking.objects.create(table=table, **validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name  = serializers.CharField(source='menu_item.name', read_only=True)
    menu_item_image = serializers.CharField(source='menu_item.image_url', read_only=True)

    class Meta:
        model  = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user  = UserSerializer(read_only=True)

    class Meta:
        model  = Order
        fields = '__all__'


class CreateOrderSerializer(serializers.Serializer):
    order_type           = serializers.CharField()
    table_id             = serializers.IntegerField(required=False, allow_null=True)
    delivery_address     = serializers.CharField(required=False, allow_blank=True)
    special_instructions = serializers.CharField(required=False, allow_blank=True)
    payment_method       = serializers.CharField(default='cash')
    items                = serializers.ListField(child=serializers.DictField())


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Review
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Offer
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactMessage
        fields = ('name', 'email', 'subject', 'message')
