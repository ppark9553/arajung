from django.contrib import auth
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views import View
from django.views.decorators.csrf import csrf_exempt

import random

class HomeView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'home.html', {})

@csrf_exempt
def login_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        auth.login(request, user)
        return HttpResponse(200)
    else:
        return HttpResponse(400)

@csrf_exempt
def logout_view(request):
    auth.logout(request)
    return HttpResponseRedirect("/")
