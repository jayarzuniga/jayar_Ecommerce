from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.db import models

from userauths.models import User, Profile
from userauths.serializer import ProfileSerializer

from store.models import Product, Category, Cart, Tax, CartOrder, CartOrderItem, Coupon, Notification, Review, Wishlist
from store.serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer, CartOrder, CartOrderItem, CouponSerializer, Coupon, NotificationSerializer, ReviewSerializer, WishlistSerializer, SummarySerializer

from vendor.models import Vendor

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from decimal import Decimal

import stripe


class DashboardStatsAPIView(generics.ListAPIView):
    serializer_class = SummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        #Calculate the summary values
        product_count = Product.objects.filter(vendor=vendor).count()
        order_count = CartOrder.objects.filter(vendor=vendor, payment_status='paid').count()
        revenue = CartOrderItem.objects.filter(vendor=vendor, order__payment_status='paid').aggregate(total_revenue= models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0

        return [{
            'products': product_count,
            'orders': order_count,
            'revenue': revenue
        }]    

    def list(self, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)                                                                                                                    