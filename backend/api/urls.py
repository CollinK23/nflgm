from django.urls import path
from . import views

urlpatterns = [
    path('compare', views.comparePlayers),
    path('stats/<str:player_id>', views.get_player_stats),
    path("leagues/<str:fan_id>", views.get_user_leagues)
]