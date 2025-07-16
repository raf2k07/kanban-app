import { removeItem } from "@/app/slices/boardSlice";
import { setCurrentItem, toggleDialog } from "@/app/slices/itemSlice";
import type { Item } from "@/app/types";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { type FunctionComponent } from "react";
import { Button } from "./ui/button";

import DeleteDarkIconUrl from "@/assets/delete_dark.svg";
import EditDarkIconUrl from "@/assets/edit_dark.svg";
import { useAppDispatch } from "@/app/hooks";

interface CardProps {
  id: UniqueIdentifier;
  item?: Item;
  columnId?: string;
  title?: string;
  ref?: (node: HTMLElement | null) => void;
  dragListeners?: React.HTMLAttributes<HTMLElement>;
  dragAttributes?: React.HTMLAttributes<HTMLElement>;
}

export const Card: FunctionComponent<CardProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  item,
  columnId,
  title,
  ref,
  dragListeners = {},
  dragAttributes = {},
  ...props
}) => {
  const dispatch = useAppDispatch();
  return (
    <div
      className="bg-white rounded-md p-2"
      ref={ref}
      {...dragListeners}
      {...dragAttributes}
      {...props}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 overflow-hidden text-ellipsis">
          <p>{title}</p>
        </div>
        {columnId && item && (
          <div className={"flex flex-row gap-2"}>
            <Button
              variant={"link"}
              className="p-0 m-0 hover:opacity-75 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                dispatch(setCurrentItem(item));
                dispatch(toggleDialog());
              }}
            >
              <img
                src={EditDarkIconUrl}
                alt={"Edit Item"}
                className={"w-5 h-5"}
              />
            </Button>
            <Button
              variant={"link"}
              className="p-0 m-0 hover:opacity-75 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                dispatch(removeItem({ columnId, itemId: item.id as string }));
              }}
            >
              <img
                src={DeleteDarkIconUrl}
                alt={"Delete Item"}
                className={"w-5 h-5"}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
