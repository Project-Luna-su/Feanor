from django.contrib import admin
from django.urls import path, re_path
from apps import views as app

urlpatterns = [
    path("", app.index, name="home"),
    path('testlog/', app.testlog),
    path("tst/", app.test),
    path("artist/<str:artist>", app.artist),
    path("playlist/<str:name>", app.playlist),
    path('integration/', app.integration),
    path("integration/templink/", app.templink),
    path("main/", app.main, name="main"),
    path("profile/", app.profile, name="profile"),
    path("profile/<str:name>", app.profile_id, name="profile"),
]