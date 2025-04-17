from django.urls import path
from . import views

urlpatterns = [
    path('rephrase/', views.rephrase_status, name='rephrase_status'),
]