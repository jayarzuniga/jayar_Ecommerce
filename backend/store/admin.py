from django.contrib import admin
from store.models import Product, Category, Gallery, Specification, Size, Color, Cart, CartOrder, CartOrderItem, Review, ProductFaq, Coupon, Notification, Wishlist, Tax

class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 0

class SpecificationInline (admin.TabularInline):
    model = Specification
    extra = 0

class SizeInline (admin.TabularInline):
    model = Size
    extra = 0

class ColorInline (admin.TabularInline):
    model = Color
    extra = 0

class ProductAdmin (admin.ModelAdmin):
    list_display =['title', 'price', 'shipping_amount', 'stock_qty', 'in_stock', 'featured']
    inlines = [GalleryInline, SpecificationInline, SizeInline, ColorInline,]
    list_editable = ["featured"]
    search_fields = ['title']

class CartOrderAdmin (admin.ModelAdmin):
    list_display =['oid', 'payment_status', 'total']
    search_fields = ['title']




admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Cart)
admin.site.register(CartOrder,CartOrderAdmin)
admin.site.register(CartOrderItem )
admin.site.register(Review)
admin.site.register(Tax)
admin.site.register(Coupon)


