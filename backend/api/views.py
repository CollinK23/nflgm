from rest_framework.response import Response
from rest_framework.decorators import api_view
from .api import getTradeValue, getPlayerStats, getUserLeagues
from django.core.cache import cache
import json

@api_view(['GET'])
def comparePlayers(request):
    playerTradeValues = "fcalcTradeValues"

    if cache.get(playerTradeValues):
        playerValues = cache.get(playerTradeValues)
        print("Hit the cache")
    else:
        playerValues = getTradeValue(is_dynasty=False, num_qbs=1, num_teams=12, ppr=1, use_espn_id=True)
        cache.set(
            playerTradeValues,
            playerValues,
            timeout=86400,
        )
        print("Hit the endpoint")

    response_data = {'players': json.loads(playerValues)}

    return Response(response_data)

@api_view(['GET'])
def get_player_stats(request, player_id):
    if cache.get(player_id):
        playerStats = cache.get(player_id)
        print("Hit the cache")
    else:
        playerStats = getPlayerStats(player_id)
        cache.set(
            player_id,
            playerStats,
            timeout=86400,
        )
        print("Hit the endpoint")

    return Response(json.loads(playerStats))

@api_view(['GET'])
def get_user_leagues(request, fan_id):
    if cache.get(fan_id):
        userLeauges = cache.get(fan_id)
        print("Hit the cache")
    else:
        userLeauges = getUserLeagues(fan_id)
        cache.set(
            fan_id,
            userLeauges,
            timeout=300
        )
        print("Hit the endpoint")

    return Response(json.loads(userLeauges))


