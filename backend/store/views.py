from django.shortcuts import render

from userauths.models import User

from store.models import Product, Category, Cart, Tax
from store.serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from decimal import Decimal

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug=slug)
    
class CartAPIView (generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = (AllowAny, )

    def create(self, request, *args, **kwargs):
        payload = request.data

        product_id = payload['product_id']
        user_id = payload['user_id']
        qty = payload['qty']
        price = payload['price']
        shipping_amount = payload['shipping_amount']
        country = payload['country']
        size = payload['size']
        color = payload['color']
        cart_id = payload['cart_id']

        product = Product.objects.get(id=product_id)
        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None

        tax = Tax.objects.filter(country=country).first()
        if tax:
            tax_rate = tax.rate / 100.
        else:
            tax_rate = 0
    

        cart = Cart.objects.filter(product=product, cart_id=cart_id).first()
        
        if cart:
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal (price) * Decimal (qty)
            cart.shipping_amount = Decimal (shipping_amount) * int (qty)
            cart.tax_fee = Decimal (tax_rate) * int (cart.sub_total)
            cart.total = int (qty) * Decimal(tax_rate)
            cart.country = country
            cart.size = size
            cart.color = color
            cart.cart_id = cart_id

            service_fee_amount = 10 / 100
            cart.service_fee = service_fee_amount * cart.sub_total
            
            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            cart.save()

            return Response({
                "message": "Cart updated successfully"}, status = status.HTTP_200_OK)
        
        else:
            cart = Cart ()
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal (price) * Decimal (qty)
            cart.shipping_amount = Decimal (shipping_amount) * int (qty)
            cart.tax_fee = Decimal (tax_rate) * int (cart.sub_total)
            cart.total = int (qty) * Decimal(tax_rate)
            cart.country = country
            cart.size = size
            cart.color = color
            cart.cart_id = cart_id

            service_fee_amount = 10 / 100
            cart.service_fee = service_fee_amount * cart.sub_total
            
            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            cart.save()

            return Response({
                "message": "Cart created successfully"}, status=HTTP_201_CREATED)