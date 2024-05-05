import requests
import json

def getTradeValue(is_dynasty=False, num_qbs=1, num_teams=12, ppr=1, use_espn_id=True):
    """
    Fetches trade values for players and returns a JSON-formatted string with key-value pairs.

    Parameters:
    - is_dynasty (bool): Whether to include dynasty information.
    - num_qbs (int): Number of quarterbacks in the league.
    - num_teams (int): Number of teams in the league.
    - ppr (int): Points per reception.
    - use_espn_id (bool): If True, uses ESPN ID as the key; if False, uses Sleeper ID as the key.

    Returns:
    - str: JSON-formatted string with player trade values.
    """
    url = f"https://api.fantasycalc.com/values/current?isDynasty={is_dynasty}&numQbs={num_qbs}&numTeams={num_teams}&ppr={ppr}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        # Define a function to extract key based on the passed variable
        def get_key(player_data):
            return player_data['player']['espnId'] if use_espn_id else player_data['player']['sleeperId']

        # Create a dictionary with key-value pairs
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


        # Convert the dictionary to a JSON string
        json_string = json.dumps(player_dict)

        return json_string
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"


def getPlayerStats(espnId):
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
                games[season_type["displayName"]]["stats"] = category["totals"]
                for event in category["events"]:
                    game_id = event["eventId"]
                    stats = event["stats"]
                    games[game_id]["stats"] = stats

                    if season_type["displayName"] == "Postseason":
                         games[game_id]["week"] += 25

        formatted_data["games"] = sorted(games.items(), key = lambda kv: kv[1]["week"])

            
        json_string = json.dumps(formatted_data)

        return json_string


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
                    "logoUrl": preference["metaData"]["entry"]["logoUrl"]
                })

        json_string = json.dumps(football_leagues)

        return json_string
        
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"