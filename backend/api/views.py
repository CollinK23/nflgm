from rest_framework.response import Response
from rest_framework.decorators import api_view
from .api import getTradeValue, getPlayerStats, getUserLeagues, getPlayersAndPositions, getPositionLeaders, getLeagueData
from django.core.cache import cache
import json

@api_view(['GET'])
def comparePlayers(request):
    playerTradeValues = "fcalcTradeValues"

    if cache.get(playerTradeValues):
        playerValues = cache.get(playerTradeValues)
    else:
        playerValues = getTradeValue(is_dynasty=False, num_qbs=1, num_teams=12, ppr=1, use_espn_id=True)
        cache.set(
            playerTradeValues,
            playerValues,
            timeout=86400,
        )

    response_data = {'players': json.loads(playerValues)}

    return Response(response_data)

@api_view(['GET'])
def get_player_stats(request, player_id):
    sleeper_id = request.GET.get('sleeperId')
    if sleeper_id and cache.get(player_id + sleeper_id):
        playerStats = cache.get(player_id + sleeper_id)
    elif cache.get(player_id):
        playerStats = cache.get(player_id)
    else:
        playerStats = getPlayerStats(player_id, sleeper_id)
        cache.set(
            player_id + str(sleeper_id) if sleeper_id is not None else "",
            playerStats,
            timeout=86400,
        )
        print("Hit the endpoint", playerStats)

    return Response(json.loads(playerStats))

@api_view(['GET'])
def get_user_leagues(request, fan_id):
    if cache.get(fan_id):
        userLeauges = cache.get(fan_id)
    else:
        userLeauges = getUserLeagues(fan_id)
        cache.set(
            fan_id,
            userLeauges,
            timeout=300
        )

    return Response(json.loads(userLeauges))

@api_view(['GET'])
def get_players_and_positions(request, position):
    if cache.get(f"{position}-players"):
        playerValues = cache.get(f"{position}-players")
    else:
        playerValues = getPlayersAndPositions(is_dynasty=False, num_qbs=1, num_teams=12, ppr=1, use_espn_id=True)
        
        playerValues = json.loads(playerValues)
        
        for i in playerValues:
            cache.set(
                f"{i}-players",
                json.dumps(playerValues[i]),
                timeout=86400,
            )

        playerValues = cache.get(f"{position}-players")

    if isinstance(playerValues, str):
        playerValues = json.loads(playerValues)

    leader_cache_key = f"{position}-leaders"
    if cache.get(leader_cache_key):
        leaders = cache.get(leader_cache_key)
    else:
        leaders = getPositionLeaders(pos=position)
        cache.set(leader_cache_key, leaders, timeout=86400)

    response_data = {'players': playerValues, 'leaders': leaders}
    return Response(response_data)

@api_view(['GET'])
def get_league_data(request):
    url = request.query_params.get('url')
    swid = request.query_params.get('swid')
    espn_s2 = request.query_params.get('espn_s2')

    data = getLeagueData(url, swid, espn_s2)
    return Response(json.loads(data))
