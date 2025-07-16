import { useSortable } from "@dnd-kit/sortable";
import type { FunctionComponent } from "react";
import { Card } from "./Card";
import type { Item } from "@/app/types";

interface BoardItemProps {
  item: Item;
  title: string;
  columnId: string;
}

const BoardItem: FunctionComponent<BoardItemProps> = ({
  item,
  title,
  columnId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: `translate3d(${transform?.x}, ${transform?.y}, 0)`,
    transition,
  };

  return (
    <Card
      key={item.id}
      item={item}
      columnId={columnId}
      title={title}
      ref={setNodeRef}
      style={style}
      dragListeners={listeners}
      dragAttributes={attributes}
    />
  );
};

export default BoardItem;
