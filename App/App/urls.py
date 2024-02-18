from django.contrib import admin
from django.urls import path
from integration_app import views as iner_views

urlpatterns = [
    path('', iner_views.index),
    path('listtrack/', iner_views.listTrack),
]
