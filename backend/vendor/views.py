from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.db import models
from django.db.models.functions import ExtractMonth

from userauths.models import User, Profile
from userauths.serializer import ProfileSerializer

from store.models import Product, Category, Cart, Tax, CartOrder, CartOrderItem, Coupon, Notification, Review, Wishlist
from store.serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer, CartOrder, CartOrderItem, CouponSerializer, Coupon, NotificationSerializer, ReviewSerializer, WishlistSerializer, SummarySerializer, EarningSerializer

from vendor.models import Vendor

from rest_framework.decorators import api_view
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from decimal import Decimal
import stripe
import requests

from datetime import datetime, timedelta


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

@api_view(('GET',))
def MonthlyOrderChartAPIView(request, vendor_id): 
    vendor = Vendor.objects.get(id=vendor_id)
    orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid')
    orders_by_month = orders.annotate(month= ExtractMonth('date')).values('month').annotate(orders=models.Count('id')).order_by('month')     
    return Response(orders_by_month)

@api_view(('GET',))
def MonthlyProductChartAPIView(request, vendor_id): 
    vendor = Vendor.objects.get(id=vendor_id)
    products = CartOrder.objects.filter(vendor=vendor, payment_status='paid')
    products_by_month = products.annotate(month= ExtractMonth('date')).values('month').annotate(products=models.Count('id')).order_by('month')     
    return Response(products_by_month)   

class ProductAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Product.objects.filter(vendor=vendor).order_by('-id')
    
class OrderAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return CartOrder.objects.filter(vendor=vendor, payment_status='paid').order_by('-id')
    
class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        order_oid = self.kwargs['order_oid']
        return CartOrderItem.objects.filter(vendor=vendor, order__id=order_oid)
    
class RevenueAPIView(generics.ListAPIView):
    serializer_class = CartOrderItemSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        
        return CartOrderItem.objects.filter(vendor=vendor, order__payment_status='paid').aggregate(total_revenue= models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0

class FilterProductAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        filter = self.request.GET.get('filter')

        if filter == 'published':
            products = Product.objects.filter(vendor=vendor, status="published")
        elif filter == 'in_review':
            products = Product.objects.filter(vendor=vendor, status="in_review")
        elif filter == 'draft':
            products = Product.objects.filter(vendor=vendor, status="draft")
        elif filter == 'disabled':
            products = Product.objects.filter(vendor=vendor, status="disabled")
        else:
            products = Product.objects.filter(vendor=vendor)

        return products

class EarningAPIView(generics.ListAPIView):
    serializer_class = EarningSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        one_month_ago = datetime.today() - timedelta(days=28)
        monthly_revenue = CartOrderItem.objects.filter(vendor=vendor, order__payment_status='paid', date__gte=one_month_ago).aggregate(total_revenue= models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0
        total_revenue =  monthly_revenue = CartOrderItem.objects.filter(vendor=vendor, order__payment_status='paid').aggregate(total_revenue= models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0

        return [{
            'monthly_revenue': monthly_revenue,
            'total_revenue': total_revenue,
        }]
    
    def list (self, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@api_view(('GET',))   
def MonthlyEarningTracker(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    monthly_earning_tracker = (
        CartOrderItem.objects
        .filter(vendor=vendor, order__payment_status='paid')
        .annotate(month= ExtractMonth('date'))
        .values('month')
        .annotate(
            sales_count= models.Sum('qty'),
            total_earning=models.Sum(
                models.F('sub_total') + models.F('shipping_amount')                 
            )       
        ).order_by('-month')
    )

    return Response(monthly_earning_tracker)

class ReviewListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Review.objects.filter(product__vendor=vendor)
    
class ReviewDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        review_id = self.kwargs['review_id']

        vendor = Vendor.objects.get(id=vendor_id)
        review = Review.objects.get(id=review_id, product__vendor=vendor)
        
        return review