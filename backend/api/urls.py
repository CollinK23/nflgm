from django.urls import path
from . import views

urlpatterns = [
    path('compare', views.comparePlayers),
    path('stats/<str:player_id>', views.get_player_stats),
    path("leagues/<str:fan_id>", views.get_user_leagues),
    path('players/<str:position>', views.get_players_and_positions),
    path('league/', views.get_league_data),
    path('rankings/', views.get_player_rankings),
    path('week/', views.get_week)
]