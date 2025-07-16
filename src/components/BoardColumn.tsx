import type { Item } from "@/app/types";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import type { FunctionComponent, ReactNode } from "react";

interface BoardColumnProps {
  children: ReactNode;
  items: Item[];
  id: UniqueIdentifier;
}

export const BoardColumn: FunctionComponent<BoardColumnProps> = ({
  children,
  items,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transition, transform } =
    useSortable({
      id,
      data: {
        type: "column",
        children: items,
      },
    });

  const style = {
    transform: `translate3d(${transform?.x}, ${transform?.y}, 0)`,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={"flex-1 flex overflow-y-auto"}
    >
      {children}
    </div>
  );
};
