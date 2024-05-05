import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type league = {
  leagueId: number;
  userId: number;
};

export interface UserState {
  leagues: league[];
}

const initialState: UserState = {
  leagues: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addLeague: (state, action: PayloadAction<league>) => {
      state.leagues.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addLeague } = userSlice.actions;

export default userSlice.reducer;
