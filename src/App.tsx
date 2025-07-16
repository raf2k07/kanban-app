import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  addColumn,
  addItem,
  moveItem,
  removeColumn,
  renameColumn,
} from "./app/slices/boardSlice";
import { persistor } from "./app/store";
import { BoardColumn } from "./components/BoardColumn";
import BoardItem from "./components/BoardItem";
import { Card } from "./components/Card";
import ItemDialog from "./components/ItemDialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { MouseSensor } from "./lib/utils";

import AddDarkIconUrl from "@/assets/add_dark.svg";
import DeleteDarkIconUrl from "@/assets/delete_dark.svg";
import { toggleDialog } from "./app/slices/itemSlice";
import { Dialog } from "./components/ui/dialog";

function App() {
  const [showRenameColumn, setShowRenameColumn] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<UniqueIdentifier | null>(
    null
  );

  const allItems = useAppSelector((state) =>
    state.board.columns.flatMap((col) => col.items)
  );
  const columns = useAppSelector((state) => state.board.columns);
  const isDialogOpen = useAppSelector((state) => state.item.isDialogOpen);
  const activeItem = useAppSelector((state) => {
    const column = state.board.columns.find((col) => col.id === activeColumnId);
    return column?.items.find((item) => item.id === activeId);
  });
  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const overId = over?.id;
    const activeId = active?.id;

    if (!overId || !activeId) {
      return;
    }

    const activeItem = allItems.find((item) => item.id === activeId);

    if (active.id !== over?.id) {
      dispatch(
        moveItem({
          currentContainerId: activeItem?.parentId as string,
          containerId: over.data.current?.sortable.containerId,
          itemId: active.id as string,
          overId: over.id as string,
        })
      );
    }

    setActiveId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveColumnId(active.data.current?.sortable.containerId);
  };

  return (
    <div className={"max-h-screen h-screen flex flex-col"}>
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-xl font-bold p-4">Kanban Board</h1>
        <div className="flex gap-2 mx-2">
          <Button variant={"outline"} onClick={() => dispatch(addColumn())}>
            Add Column
          </Button>
          <Button variant={"outline"} onClick={() => persistor.purge()}>
            New Board
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        // omitted for performance reasons, although it would definitely look nicer
        // onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        <div className="flex flex-row gap-4 p-4 overflow-x-auto overflow-y-hidden h-full text-left flex-1">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex min-w-72 max-w-64 flex-col p-4 pr-2 min-h-64 h-full bg-gray-200 rounded-md overflow-y-hidden relative"
            >
              <div>
                {showRenameColumn === column.id ? (
                  <div>
                    <Input
                      autoFocus
                      type="text"
                      defaultValue={column.name}
                      onBlur={(e) => {
                        if (e.target.value.trim() !== "") {
                          dispatch(
                            renameColumn({
                              id: column.id,
                              name: e.target.value,
                            })
                          );
                        }
                        setShowRenameColumn(null);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="flex justify-between align-center px-0"
                    onClick={() => setShowRenameColumn(column.id)}
                  >
                    <p className="text-left">{column.name}</p>
                    <Button
                      className="pt-0 px-4 cursor-pointer hover:opacity-75"
                      variant={"link"}
                      onClick={() => dispatch(removeColumn(column.id))}
                    >
                      <img
                        src={DeleteDarkIconUrl}
                        alt="Delete Column"
                        className="w-5 h-5"
                      />
                    </Button>
                  </div>
                )}
              </div>
              <SortableContext
                id={column.id}
                items={column.items}
                strategy={verticalListSortingStrategy}
              >
                <BoardColumn items={column.items} id={column.id}>
                  <div className="flex flex-col flex-1 max-h-full gap-2 my-2 overflow-y-auto pr-2">
                    {column.items.map(
                      (item) => (
                        // activeId === item.id ? null : (
                        <BoardItem
                          key={item.id}
                          item={item}
                          columnId={column.id}
                          title={item.title}
                        />
                      )
                      // )
                    )}
                  </div>
                </BoardColumn>
              </SortableContext>
              {/* <div className="mt-auto mr-4"> */}
              <div className={"mr-2"}>
                {showAddItem === column.id ? (
                  <div className={"flex flex-col gap-1"}>
                    <Textarea
                      className="mb-2 bg-white"
                      autoFocus
                      placeholder="Item title"
                      onChange={(e) => setNewItem(e.target.value)}
                    />
                    <div className={"flex gap-2"}>
                      <Button
                        className={"flex-1"}
                        onClick={() => {
                          if (newItem) {
                            dispatch(
                              addItem({
                                columnId: column.id,
                                title: newItem,
                              })
                            );
                            setNewItem("");
                            setShowAddItem(null);
                          }
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        className={"flex-1"}
                        variant={"outline"}
                        onClick={() => {
                          setShowAddItem(null);
                          setNewItem("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      className={"w-full cursor-pointer hover:opacity-75"}
                      variant={"outline"}
                      onClick={() => setShowAddItem(column.id)}
                    >
                      <img
                        src={AddDarkIconUrl}
                        alt={"Add Item"}
                        className={"w-4 h-4"}
                      />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeId ? <Card id={activeId} title={activeItem?.title} /> : null}
        </DragOverlay>
      </DndContext>
      <Dialog open={isDialogOpen} onOpenChange={() => dispatch(toggleDialog())}>
        <ItemDialog />
      </Dialog>
    </div>
  );
}

export default App;
