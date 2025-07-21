import { createSlice } from "@reduxjs/toolkit"

export const visibilitySlice = createSlice({
    name: 'visibility',
    initialState: {
        showMore: false,
        showMoreService: false
    },
    reducers: {
        toggleShowMore: state => {
            state.showMore = !state.showMore
        },
        toggleShowMoreService: state => {
            state.showMoreService = !state.showMoreService
        },
        setShowMore: (state, action) => {
            state.showMore = action.payload
        },
        setShowMoreService: (state, action) => {
            state.showMoreService = action.payload
        }
    }

})

export const { toggleShowMore, toggleShowMoreService, setShowMore, setShowMoreService } = visibilitySlice.actions
export default visibilitySlice.reducer