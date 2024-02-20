from django.contrib import admin
from django.urls import path, re_path

from apps import views as app

urlpatterns = [
    path("", app.index, name="home"),
    path('testlog/', app.testlog),
    path("artist/<str:artist>", app.artist),
    path('integration/', app.integration),
    path("integration/templink/", app.templink)
]
