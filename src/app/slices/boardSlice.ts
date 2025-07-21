import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { Column, Item } from "../types";
import { PURGE } from "redux-persist";

interface boardState {
  numberOfColumns: number;
  columns: Column[];
}

const initialState: boardState = {
  numberOfColumns: 3,
  columns: [
    { id: uuidv4(), name: "To Do", items: [] },
    { id: uuidv4(), name: "In Progress", items: [] },
    { id: uuidv4(), name: "Done", items: [] },
  ],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addColumn: (state) => {
      state.numberOfColumns += 1;
      state.columns.push({
        id: uuidv4(),
        name: `Column ${state.numberOfColumns}`,
        items: [],
      });
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      if (state.numberOfColumns > 0) {
        state.numberOfColumns -= 1;
        const column = state.columns.find(
          (column) => column.id === action.payload
        );
        if (column) {
          state.columns.splice(state.columns.indexOf(column), 1);
        }
      }
    },
    renameColumn: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const column = state.columns.find((col) => col.id === action.payload.id);
      if (column) {
        column.name = action.payload.name;
      }
    },
    addItem: (
      state,
      action: PayloadAction<{ columnId: string; title: string }>
    ) => {
      const column = state.columns.find(
        (col) => col.id === action.payload.columnId
      );
      if (column) {
        column.items.push({
          id: uuidv4(),
          parentId: column.id,
          title: action.payload.title,
          labels: [],
          description: "",
        });
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ columnId: string; itemId: string }>
    ) => {
      const { columnId, itemId } = action.payload;

      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        const itemIndex = column.items.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
          column.items.splice(itemIndex, 1);
        }
      }
    },
    updateItem: (state, action: PayloadAction<{ item: Item }>) => {
      const { item } = action.payload;
      const column = state.columns.find((col) => col.id === item.parentId);
      if (column) {
        const itemIndex = column.items.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
          column.items[itemIndex] = item;
        }
      }
    },
    moveItem: (
      state,
      action: PayloadAction<{
        currentContainerId: string;
        containerId: string;
        itemId: string;
        overId?: string;
        itemType: "column" | null;
      }>
    ) => {
      const { currentContainerId, containerId, itemId, overId, itemType } =
        action.payload;

      const currentColumn = state.columns.find(
        (col) => col.id === currentContainerId
      );
      const targetColumn = state.columns.find((col) => col.id === containerId);

      const indexInCurrentColumn = currentColumn?.items.findIndex(
        (item) => item.id === itemId
      );

      // sometimes the collision detection returns the columnId as overId even when the column has items, this should remedy it
      // if the overId is column Id, add item to end of array, else find the index
      const indexInTargetColumn =
        itemType === "column"
          ? targetColumn?.items.length
          : targetColumn?.items.findIndex((item) => {
              return item.id === overId;
            });

      const itemToMove = currentColumn?.items[indexInCurrentColumn!];

      if (currentColumn && targetColumn && itemToMove) {
        // Remove item from current column
        currentColumn.items.splice(indexInCurrentColumn!, 1);

        // Add item to target column at the specified index
        targetColumn.items.splice(indexInTargetColumn!, 0, {
          ...itemToMove,
          parentId: targetColumn.id, // Update parentId to the new column's id
        });
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
  addColumn,
  removeColumn,
  renameColumn,
  addItem,
  removeItem,
  updateItem,
  moveItem,
} = boardSlice.actions;

export default boardSlice.reducer;
