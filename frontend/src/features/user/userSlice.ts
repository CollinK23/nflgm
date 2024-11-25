import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export type league = {
  teamName: string;
  teamAbbrev: string;
  leagueFormatTypeId: number;
  scoringTypeId: number;
  groupId: number;
  groupName: string;
  groupSize: number;
  logoUrl: string;
  teamId: string;
  espn_s2: string;
};

export type trade = {
  team0: {
    data: any;
    players: {
      [key: string | number]: any;
    };
  };
  team1: {
    data: any;
    players: {
      [key: string | number]: any;
    };
  };
};

export interface UserState {
  leagues: league[];
  trade: trade;
  userId: string;
  selectedLeague: string | null;
  swid?: string;
}

const initialState: UserState = {
  leagues: [],
  userId: "",
  trade: {
    team0: {
      data: null,
      players: {},
    },
    team1: {
      data: null,
      players: {},
    },
  },
  selectedLeague: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addLeague: (state, action: PayloadAction<league[]>) => {
      action.payload.forEach((league) => {
        const existingLeague = state.leagues.find(
          (l) => l.groupId === league.groupId
        );
        league.espn_s2 = existingLeague?.espn_s2 || "";
      });
      state.leagues = action.payload;
    },
    selectPlayer: (
      state,
      action: PayloadAction<{ player: any; teamSelected: number }>
    ) => {
      const player = action.payload.player;
      const espnId = action.payload.player.espnId;
      if (action.payload.teamSelected === 0) {
        if (!(espnId in state.trade.team0.players)) {
          state.trade.team0.players[espnId] = player;
        } else {
          delete state.trade.team0.players[espnId];
        }
      } else {
        if (!(espnId in state.trade.team1.players)) {
          state.trade.team1.players[espnId] = player;
        } else {
          delete state.trade.team1.players[espnId];
        }
      }
    },
    removeTradeSelections: (state, action: PayloadAction<number>) => {
      state.trade[`team${action.payload}`] = {
        data: null,
        players: {},
      };
    },
    addTradeSelections: (
      state,
      action: PayloadAction<{ teamSelected: number; team: any }>
    ) => {
      state.trade[`team${action.payload.teamSelected}`] = {
        data: action.payload.team,
        players: {},
      };
    },
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    updateSelectedLeague: (state, action: PayloadAction<string | null>) => {
      state.selectedLeague = action.payload;
    },
    updateEspnS2: (
      state,
      action: PayloadAction<{ espn_s2: string; espnId: string }>
    ) => {
      state.leagues.find(
        (league) => league.groupId == parseInt(action.payload.espnId)
      ).espn_s2 = action.payload.espn_s2;
    },
    updateSwid: (state, action: PayloadAction<string>) => {
      state.swid = action.payload;
    },
  },
});

export const {
  addLeague,
  selectPlayer,
  removeTradeSelections,
  addTradeSelections,
  updateUserId,
  updateSelectedLeague,
  updateEspnS2,
  updateSwid,
} = userSlice.actions;

const persistConfig = {
  key: "user",
  storage,
};

export const persistedUserReducer = persistReducer(
  persistConfig,
  userSlice.reducer
);
