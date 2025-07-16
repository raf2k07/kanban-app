import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Comment, Item } from "../types";
import { v4 as uuidv4 } from "uuid";
import { PURGE } from "redux-persist";

interface itemState {
  currentItem: Item | null;
  comments: { [key: string]: Comment[] };
  isDialogOpen: boolean;
}

const initialState: itemState = {
  currentItem: null,
  comments: {},
  isDialogOpen: false,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    toggleDialog: (state) => {
      state.isDialogOpen = !state.isDialogOpen;
      if (!state.isDialogOpen) {
        state.currentItem = null;
      }
    },
    setCurrentItem: (state, action: PayloadAction<Item>) => {
      state.currentItem = action.payload;
    },
    addComment: (
      state,
      action: PayloadAction<{
        itemId: string;
        content: string;
        parentId: string | null;
      }>
    ) => {
      const { itemId, content, parentId } = action.payload;
      if (!state.comments[itemId]) {
        state.comments[itemId] = [];
      }
      const newComment: Comment = {
        id: uuidv4(),
        parentId,
        content,
      };
      state.comments[itemId].push(newComment);
    },
    editComment: (
      state,
      action: PayloadAction<{
        itemId: string;
        commentId: string;
        content: string;
      }>
    ) => {
      const { itemId, commentId, content } = action.payload;
      if (state.comments[itemId]) {
        const comment = state.comments[itemId].find((c) => c.id === commentId);
        if (comment) {
          comment.content = content;
          comment.edited = true;
        }
      }
    },
    deleteComment: (
      state,
      action: PayloadAction<{ itemId: string; commentId: string }>
    ) => {
      const { itemId, commentId } = action.payload;
      if (state.comments[itemId]) {
        state.comments[itemId] = state.comments[itemId].filter(
          (comment) => comment.id !== commentId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  toggleDialog,
  setCurrentItem,
  addComment,
  editComment,
  deleteComment,
} = itemSlice.actions;

export default itemSlice.reducer;
