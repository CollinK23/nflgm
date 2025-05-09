from rest_framework.response import Response
from rest_framework.decorators import api_view
from .api import getTradeValue, getPlayerStats, getUserLeagues, getPlayersAndPositions, getPositionLeaders, getPrivateLeagueData, getPlayerRankings, getWeek, getLeagueSettings
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
    
    data = getPrivateLeagueData(url, swid, espn_s2)
    return Response(json.loads(data))

@api_view(['GET'])
def get_player_rankings(request):
    slotId = request.query_params.get('slotId')
    scoring = request.query_params.get('scoring')
    week = request.query_params.get('week')
    totals = request.query_params.get('totals')
    offset = request.query_params.get('offset')

    id = slotId + scoring + week + totals + offset

    if cache.get(id):
        playerRankings = cache.get(id)
    else:
        playerRankings = getPlayerRankings([int(num) for num in slotId.split(",")], scoring, week, totals, offset)
        cache.set(
            id,
            playerRankings,
            timeout=300
        )

    return Response(json.loads(playerRankings))

@api_view(['GET'])
def get_week(request):
    id = "weekAndSeason"
    if cache.get(id):
        week = cache.get(id)
    else:
        week = getWeek()
        cache.set(
            id,
            week,
            timeout=3600
        )

    return Response(json.loads(week))

@api_view(['GET'])
def get_league_settings(request):
    league_id = request.query_params.get('leagueId')
    id = "LeagueSettings" + league_id
    if cache.get(id):
        leagueSettings = cache.get(id)
    else:
        leagueSettings = getLeagueSettings(league_id)
        cache.set(
            id,
            leagueSettings,
            timeout=3600
        )

    return Response(json.loads(leagueSettings))