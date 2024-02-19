from django.shortcuts import render
from django.http import HttpResponse

def index(req):
    return render(req, "login.html")