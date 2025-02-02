import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BoardState {
  axisLabels: {
    top: string
    bottom: string
    left: string
    right: string
  }
}

const initialState: BoardState = {
  axisLabels: {
    top: 'Good',
    bottom: 'Evil',
    left: 'Lawful',
    right: 'Chaotic'
  }
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setAxisLabels: (state, action: PayloadAction<BoardState['axisLabels']>) => {
      state.axisLabels = action.payload
    }
  }
})

export const { setAxisLabels } = boardSlice.actions
export default boardSlice.reducer
