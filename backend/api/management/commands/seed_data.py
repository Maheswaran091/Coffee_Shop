from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Category, MenuItem, Table, Offer, UserProfile
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Seeds the database with initial coffee shop data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Categories
        cat_data = [
            ('Coffee', 'coffee', 'coffee', 'Premium hand-crafted coffees from around the world'),
            ('Cookies', 'cookies', 'cookie', 'Fresh baked cookies made daily'),
            ('Cakes', 'cakes', 'cake', 'Artisan cakes and exquisite pastries'),
            ('Biscuits', 'biscuits', 'biscuit', 'Crunchy and delicious biscuits'),
            ('Snacks', 'snacks', 'snack', 'Light bites and savory snacks'),
            ('Beverages', 'beverages', 'beverage', 'Refreshing cold drinks and smoothies'),
        ]
        for name, slug, icon, desc in cat_data:
            Category.objects.get_or_create(slug=slug, defaults={'name': name, 'icon': icon, 'description': desc})
        self.stdout.write('  Categories created')

        coffee = Category.objects.get(slug='coffee')
        cookies = Category.objects.get(slug='cookies')
        cakes = Category.objects.get(slug='cakes')
        biscuits = Category.objects.get(slug='biscuits')
        snacks = Category.objects.get(slug='snacks')
        beverages = Category.objects.get(slug='beverages')

        # Menu items: (cat, name, desc, price, is_veg, prep_min, rating, calories)
        menu_data = [
            # Coffee
            (coffee, 'Espresso', 'Rich and bold single shot espresso with deep crema', 120, False, 3, 4.8, 5),
            (coffee, 'Cappuccino', 'Creamy espresso with steamed milk and velvety foam', 180, True, 5, 4.9, 120),
            (coffee, 'Latte', 'Smooth espresso with steamed milk and a hint of foam', 200, True, 5, 4.7, 190),
            (coffee, 'Americano', 'Espresso shots topped with hot water for a smooth taste', 150, False, 3, 4.6, 15),
            (coffee, 'Mocha', 'Espresso with rich chocolate sauce and steamed milk', 220, True, 5, 4.8, 370),
            (coffee, 'Cold Brew', 'Smooth cold-steeped coffee served over ice', 250, False, 0, 4.9, 80),
            (coffee, 'Flat White', 'Double ristretto shots with silky microfoam milk', 190, True, 4, 4.7, 120),
            (coffee, 'Macchiato', 'Espresso marked with a dollop of steamed milk foam', 160, True, 3, 4.6, 30),
            # Cookies
            (cookies, 'Chocolate Chip Cookie', 'Classic cookie loaded with premium chocolate chips', 80, True, 0, 4.8, 210),
            (cookies, 'Oatmeal Raisin Cookie', 'Wholesome oatmeal with plump juicy raisins', 75, True, 0, 4.5, 195),
            (cookies, 'Double Chocolate Cookie', 'Rich chocolate dough loaded with dark chocolate chunks', 90, True, 0, 4.9, 280),
            (cookies, 'Almond Butter Cookie', 'Nutty and chewy almond butter delight', 95, True, 0, 4.6, 240),
            (cookies, 'Snickerdoodle', 'Soft cinnamon sugar coated classic cookie', 80, True, 0, 4.7, 200),
            # Cakes
            (cakes, 'Blueberry Cheesecake', 'Creamy New York-style cheesecake with fresh blueberry topping', 320, True, 0, 4.9, 420),
            (cakes, 'Chocolate Fudge Cake', 'Dense moist chocolate cake with rich fudge frosting', 280, True, 0, 4.8, 510),
            (cakes, 'Carrot Walnut Cake', 'Moist spiced carrot cake with cream cheese frosting', 260, True, 0, 4.7, 380),
            (cakes, 'Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', 350, True, 0, 4.9, 450),
            (cakes, 'Lemon Tart', 'Bright zesty lemon curd in a buttery pastry shell', 240, True, 0, 4.6, 320),
            # Biscuits
            (biscuits, 'Butter Biscuit', 'Flaky golden butter biscuit, perfect with coffee', 60, True, 0, 4.5, 170),
            (biscuits, 'Cheese Crackers', 'Sharp cheddar cheese baked crackers', 80, True, 0, 4.4, 220),
            (biscuits, 'Digestive Biscuits', 'Wholesome wheat digestive biscuits', 70, True, 0, 4.3, 150),
            (biscuits, 'Jeera Biscuit', 'Savory cumin-spiced Indian-style biscuits', 65, True, 0, 4.6, 160),
            (biscuits, 'Nan Khatai', 'Cardamom-flavored Indian shortbread biscuits', 75, True, 0, 4.7, 200),
            # Snacks
            (snacks, 'Avocado Toast', 'Sourdough toast with smashed avocado, eggs and chili flakes', 280, True, 8, 4.8, 320),
            (snacks, 'Butter Croissant', 'Buttery flaky French croissant, baked fresh daily', 150, True, 0, 4.7, 270),
            (snacks, 'Club Sandwich', 'Triple-decker sandwich with chicken, lettuce, tomato and mayo', 320, False, 12, 4.6, 580),
            (snacks, 'Veg Wrap', 'Grilled vegetables with hummus and feta in a whole wheat wrap', 260, True, 10, 4.5, 420),
            (snacks, 'Banana Muffin', 'Moist banana muffin with chocolate chips and walnut crumble', 120, True, 0, 4.7, 310),
            # Beverages
            (beverages, 'Mango Smoothie', 'Fresh Alphonso mango blended with yogurt and honey', 200, True, 0, 4.8, 280),
            (beverages, 'Green Detox Juice', 'Spinach, cucumber, apple and ginger cold-pressed juice', 220, True, 0, 4.6, 120),
            (beverages, 'Iced Matcha Latte', 'Ceremonial grade matcha with oat milk served over ice', 250, True, 0, 4.9, 180),
            (beverages, 'Berry Blast Smoothie', 'Mixed berry and banana smoothie with chia seeds', 230, True, 0, 4.7, 260),
            (beverages, 'Fresh Lime Soda', 'Freshly squeezed lime with sparkling water and mint', 120, True, 0, 4.5, 60),
        ]

        for cat, name, desc, price, veg, prep, rating, cal in menu_data:
            MenuItem.objects.get_or_create(
                name=name, category=cat,
                defaults={
                    'description': desc, 'price': price, 'is_available': True,
                    'is_veg': veg, 'is_featured': rating >= 4.8,
                    'preparation_time': prep, 'rating': rating,
                    'calories': cal, 'review_count': 42,
                }
            )
        self.stdout.write('  Menu items created')

        # Tables
        table_data = [
            (1, 2, 'Window Seat', True, True),
            (2, 2, 'Window Seat', True, True),
            (3, 4, 'Indoor', True, False),
            (4, 4, 'Indoor', True, False),
            (5, 6, 'Private Room', True, False),
            (6, 2, 'Outdoor Patio', False, False),
            (7, 4, 'Outdoor Patio', False, False),
            (8, 8, 'Conference Room', True, False),
            (9, 2, 'Bar Counter', False, False),
            (10, 4, 'Indoor', True, False),
            (11, 2, 'Garden View', False, True),
            (12, 6, 'Family Section', True, False),
        ]
        for num, cap, loc, power, window in table_data:
            Table.objects.get_or_create(
                table_number=num,
                defaults={'capacity': cap, 'location': loc, 'has_power_outlet': power, 'has_window_view': window}
            )
        self.stdout.write('  Tables created')

        # Offers
        Offer.objects.get_or_create(code='WELCOME20', defaults={
            'title': 'Welcome Offer - 20% Off',
            'description': 'Get 20% off on your first order! Use code WELCOME20.',
            'discount_percent': 20,
            'valid_from': timezone.now(),
            'valid_until': timezone.now() + timedelta(days=365),
            'is_active': True, 'min_order_amount': 200,
        })
        Offer.objects.get_or_create(code='BREW10', defaults={
            'title': 'Coffee Lovers Deal - 10% Off',
            'description': '10% off on all coffee orders above Rs.100.',
            'discount_percent': 10,
            'valid_from': timezone.now(),
            'valid_until': timezone.now() + timedelta(days=180),
            'is_active': True, 'min_order_amount': 100,
        })
        Offer.objects.get_or_create(code='WEEKEND25', defaults={
            'title': 'Weekend Special - 25% Off',
            'description': 'Enjoy 25% off on weekends! Valid Sat & Sun.',
            'discount_percent': 25,
            'valid_from': timezone.now(),
            'valid_until': timezone.now() + timedelta(days=90),
            'is_active': True, 'min_order_amount': 300,
        })
        self.stdout.write('  Offers created')

        # Users
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser('admin', 'admin@coffeeshop.com', 'admin123')
            UserProfile.objects.get_or_create(user=admin_user)
            self.stdout.write('  Admin user: admin / admin123')

        if not User.objects.filter(username='demo').exists():
            demo_user = User.objects.create_user(
                'demo', 'demo@coffeeshop.com', 'demo123',
                first_name='Demo', last_name='User'
            )
            UserProfile.objects.get_or_create(user=demo_user, defaults={'phone': '9999999999', 'loyalty_points': 150})
            self.stdout.write('  Demo user: demo / demo123')

        self.stdout.write(self.style.SUCCESS('\nDatabase seeded successfully!'))
        self.stdout.write('\nLogin credentials:')
        self.stdout.write('  Admin panel: http://localhost:8000/admin/ (admin / admin123)')
        self.stdout.write('  Demo user: demo / demo123')
