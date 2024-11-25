import requests
import json
import urllib.parse


def getTradeValue(is_dynasty=False, num_qbs=1, num_teams=12, ppr=1, use_espn_id=True):
    url = f"https://api.fantasycalc.com/values/current?isDynasty={is_dynasty}&numQbs={num_qbs}&numTeams={num_teams}&ppr={ppr}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        def get_key(player_data):
            return player_data['player']['espnId'] if use_espn_id else player_data['player']['sleeperId']

        player_dict = {}

        if is_dynasty:
            for player_data in data:
                if player_data['value'] <= 200:
                    break
                player_dict[get_key(player_data)] = {
                    "value": player_data['value'],
                    "redraftValue": player_data['value'],
                }
        else:
            for player_data in data:
                if player_data['value'] <= 200:
                    break

                if player_data['redraftValue'] > 200:
                    player_dict[get_key(player_data)] = {
                        "value": player_data['value'],
                        "redraftValue": player_data['value'],
                    }

        json_string = json.dumps(player_dict)

        return json_string
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"
    
def getPlayersAndPositions(is_dynasty=False, num_qbs=1, num_teams=12, ppr=1, use_espn_id=True):
    url = f"https://api.fantasycalc.com/values/current?isDynasty={is_dynasty}&numQbs={num_qbs}&numTeams={num_teams}&ppr={ppr}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        def get_key(player_data):
            return {"espnId": player_data['player']['espnId'], "sleeperId": player_data['player']['sleeperId']}

        player_dict = {}

        for player_data in data:
            if player_data["player"]["position"] not in player_dict:
                player_dict[player_data["player"]["position"]] = []
            player_dict[player_data["player"]["position"]].append({player_data["player"]["name"]: get_key(player_data)})

        json_string = json.dumps(player_dict)

        return json_string
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"


def getPlayerStats(espnId, sleeperId=None):
    url = f"https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/{espnId}/gamelog"
    response = requests.get(url)


    if response.status_code == 200:
        data = response.json()

        formatted_data = {}
        games = {}

        formatted_data["labels"] = data["labels"]

        for game_id, event_data in data["events"].items():
            games[game_id] = {
                "week": event_data["week"],
                "atVs": event_data["atVs"],
                "score": event_data["score"],
                "gameResult": event_data["gameResult"],
                "opponentId": event_data["opponent"]["id"]
            }


        week = 25
        display = "Regular Season"

        for season_type in data["seasonTypes"][::-1]:
            games[season_type["displayName"]] = {
                    "week": week,
                    "atVs": display,
                    "score": "Totals",
                    "gameResult": None,
                    "opponentId": None,
            }
            week = 100
            display = "Postseason"
            for category in season_type["categories"]:
                if "totals" in category:
                    games[season_type["displayName"]]["stats"] = category["totals"]
                    for event in category["events"]:
                        game_id = event["eventId"]
                        stats = event["stats"]
                        games[game_id]["stats"] = stats

                        if season_type["displayName"] == "Postseason":
                            games[game_id]["week"] += 25

        formatted_data["games"] = sorted(games.items(), key = lambda kv: kv[1]["week"])


        if sleeperId:
            formatted_data["fantasy"] = getPlayerFantasyPoints(sleeperId)

            
        json_string = json.dumps(formatted_data)

        return json_string


    else:
        return f"Failed to fetch data. Status code: {response.status_code}"

def getPlayerFantasyPoints(sleeper_id, season=2024):
    url = f"https://api.sleeper.com/stats/nfl/player/{sleeper_id}?season_type=regular&season={season}&grouping=week"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        fantasy_points = []

        for i in range(1, 19):
            week = {}
            if data[str(i)] != None:

                if "pts_ppr" in data[str(i)]["stats"]:
                    week["pts_ppr"] = data[str(i)]["stats"]["pts_ppr"]

                if "pts_half_ppr" in data[str(i)]["stats"]:
                    week["pts_half_ppr"] = data[str(i)]["stats"]["pts_half_ppr"]

                if "pts_std" in data[str(i)]["stats"]:
                    week["pts_std"] = data[str(i)]["stats"]["pts_std"]
                week["date"] = data[str(i)]["date"]
            else:
                week = None

            fantasy_points.append(week)

        return fantasy_points
    
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"
    
def getUserLeagues(fan_id):
    url = f"https://fan.api.espn.com/apis/v2/fans/{fan_id}?displayEvents=true&displayNow=true&displayRecs=true&displayHiddenPrefs=true&featureFlags=expandAthlete&featureFlags=isolateEvents&featureFlags=challengeEntries&recLimit=5&showAirings=buy%2Clive%2Creplay"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        football_leagues = []

        for preference in data["preferences"]:
            if preference["type"]["id"] == 9:
                football_leagues.append({
                    "teamName": preference["metaData"]["entry"]["entryMetadata"]["teamName"],
                    "teamAbbrev": preference["metaData"]["entry"]["entryMetadata"]["teamAbbrev"],
                    "leagueFormatTypeId": preference["metaData"]["entry"]["entryMetadata"]["leagueFormatTypeId"],
                    "scoringTypeId": preference["metaData"]["entry"]["entryMetadata"]["scoringTypeId"],
                    "groupId": preference["metaData"]["entry"]["groups"][0]["groupId"],
                    "groupName": preference["metaData"]["entry"]["groups"][0]["groupName"],
                    "groupSize": preference["metaData"]["entry"]["groups"][0]["groupSize"],
                    "logoUrl": preference["metaData"]["entry"]["logoUrl"],
                    "teamId" : urllib.parse.parse_qs(urllib.parse.urlparse(preference["metaData"]["entry"]["groups"][0]["fantasyCastHref"]).query).get('teamId', [None])[0],
                })

        json_string = json.dumps(football_leagues)

        return json_string
        
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"


def getPositionLeaders(pos, categoryParam = "offense"):
    searchParams = {
        "WR":  [
            "receiving.receptions",
            "receiving.receivingTargets",
            "receiving.receivingYards",
            "receiving.yardsPerReception",
            "receiving.receivingTouchdowns",
            "rushing.rushingAttempts",
            "rushing.rushingYards",
            "rushing.yardsPerRushAttempt",
            "rushing.rushingTouchdowns",
            "rushing.rushingYardsPerGame",
        ],
        "TE": [
            "receiving.receptions",
            "receiving.receivingTargets",
            "receiving.receivingYards",
            "receiving.yardsPerReception",
            "receiving.receivingTouchdowns"
        ],
        "RB": [
            "receiving.receptions",
            "receiving.receivingTargets",
            "receiving.receivingYards",
            "receiving.yardsPerReception",
            "receiving.receivingTouchdowns",
            "rushing.rushingAttempts",
            "rushing.rushingYards",
            "rushing.yardsPerRushAttempt",
            "rushing.rushingTouchdowns",
            "rushing.rushingYardsPerGame",
        ],
        "QB": [
            "rushing.rushingAttempts",
            "rushing.rushingYards",
            "rushing.yardsPerRushAttempt",
            "rushing.rushingTouchdowns",
            "rushing.rushingYardsPerGame",
            "passing.completionPct",
            "passing.passingYards",
            "passing.interceptions",
            "passing.passingTouchdowns",
            "passing.passingYardsPerGame"
        ]
    }

    catMap = {
        "rushing.rushingAttempts" : 0,
        "rushing.rushingYards": 1,
        "rushing.yardsPerRushAttempt": 2,
        "rushing.rushingTouchdowns": 5,
        "rushing.rushingYardsPerGame": 6,
        "passing.completionPct": 2,
        "passing.passingYards": 3,
        "passing.interceptions": 8,
        "passing.passingTouchdowns": 7,
        "passing.passingYardsPerGame": 5,
        "receiving.receptions": 0,
        "receiving.receivingTargets": 1,
        "receiving.receivingYards": 2,
        "receiving.yardsPerReception": 3,
        "receiving.receivingTouchdowns": 4
    }
    leaders = {}

    for i, cat in enumerate(searchParams[pos]):
        url = f"https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/statistics/byathlete?region=us&lang=en&contentorigin=espn&isqualified=true&page=1&limit=100&sort={cat}%3Adesc&season=2024&seasontype=2"

        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            catPrefix = cat.split(".")[0]

            for athlete in data["athletes"]:
                for category in athlete["categories"]:
                    if category["name"] == catPrefix:
                        if pos == athlete["athlete"]["position"]["abbreviation"]:
                            leaders[cat] = category["totals"][catMap[cat]]
                            break
                if pos == athlete["athlete"]["position"]["abbreviation"]:
                    break
                            
        
        else:
            return f"Failed to fetch data. Status code: {response.status_code}"
        
    return leaders

def getPrivateLeagueData(url, swid, espn_s2):
    if swid and espn_s2:
        response = requests.get(url, cookies={"SWID": swid, "espn_s2": espn_s2})
    else:
        response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return json.dumps(data)
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"

        
            
