import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateItem } from "@/app/slices/boardSlice";
import {
  addComment,
  deleteComment,
  editComment,
  toggleDialog,
} from "@/app/slices/itemSlice";
import type { Item } from "@/app/types";
import ArrowForwardUrl from "@/assets/arrow_forward.svg";
import DeleteDarkIconUrl from "@/assets/delete_dark.svg";
import EditDarkIconUrl from "@/assets/edit_dark.svg";
import { useEffect, useState, type FunctionComponent } from "react";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const ItemDialog: FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const item = useAppSelector((state) => state.item.currentItem);
  const comments = useAppSelector((state) => {
    if (!item) return [];
    return state.item.comments[item.id] || [];
  });

  const columns = useAppSelector((state) => state.board.columns);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentColumn, setParentColumn] = useState("");

  const [comment, setComment] = useState("");
  const [edit, setEdit] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [showCommentEdit, setShowCommentEdit] = useState<string | null>(null);

  useEffect(() => {
    setComment("");
    if (item) {
      setTitle(item.title);
      setDescription(item.description || "");
      setParentColumn(item.parentId);
    }
  }, [item?.title, item?.description, item]);

  useEffect(() => {
    if (showCommentEdit) {
      const commentToEdit = comments.find((c) => c.id === showCommentEdit);
      if (commentToEdit) {
        setEdit(commentToEdit.content);
      }
    }
  }, [showCommentEdit, comments]);

  return (
    <DialogContent className={"max-w-lg m-auto"}>
      <DialogHeader>
        <DialogTitle>Edit Item</DialogTitle>
      </DialogHeader>
      <div className={"m-4 p-4"}>
        <div className={"mb-4"}>
          <h3 className={"text-md font-semibold mb-1"}>Title</h3>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className={"mb-4"}>
          <h3 className={"text-md font-semibold mb-1"}>Description</h3>
          <Textarea
            placeholder={"Enter a description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={"mb-4"}>
          <h3 className={"text-md font-semibold mb-1"}>Column</h3>
          <Select
            onValueChange={(value) => {
              setParentColumn(value);
            }}
            value={parentColumn}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          {/* TODO Comment Section */}
          {/* render comment tree */}
          <h3 className={"text-md font-semibold mb-1"}>Comments</h3>
          <div className={"max-h-72 overflow-auto"}>
            {comments.map((comment) =>
              showCommentEdit === comment.id ? (
                <div key={comment.id} className="flex flex-row gap-2 my-4">
                  <Input
                    value={edit}
                    onChange={(e) => setEdit(e.target.value)}
                    placeholder="Edit comment"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (edit) {
                        dispatch(
                          editComment({
                            itemId: item!.id,
                            commentId: comment.id,
                            content: edit,
                          })
                        );
                        setShowCommentEdit(null);
                        setEdit("");
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant={"link"}
                    className={"p-1 hover:opacity-75 cursor-pointer"}
                    onClick={() => setShowCommentEdit(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div
                  key={comment.id}
                  className="text-sm my-4 p-1 px-4 bg-gray-100 rounded-md flex flex-row justify-between items-center"
                >
                  <p className={"flex-1"}>{comment.content}</p>
                  <Button
                    variant={"link"}
                    className={"p-1 hover:opacity-75 cursor-pointer"}
                    onClick={() => setShowCommentEdit(comment.id)}
                  >
                    <img
                      src={EditDarkIconUrl}
                      alt={"edit comment"}
                      className={"w-5 h-5"}
                    />
                  </Button>
                  <Button
                    className={"p-1 hover:opacity-75 cursor-pointer"}
                    variant={"link"}
                    onClick={() =>
                      dispatch(
                        deleteComment({
                          itemId: item!.id,
                          commentId: comment.id,
                        })
                      )
                    }
                  >
                    <img
                      src={DeleteDarkIconUrl}
                      alt={"delete comment"}
                      className={"w-5 h-5"}
                    />
                  </Button>
                </div>
              )
            )}
          </div>
          <div className="flex flex-row mt-4">
            <Input
              placeholder={"Leave a comment"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              className={"ml-2"}
              onClick={() => {
                if (comment) {
                  dispatch(
                    addComment({
                      itemId: item!.id,
                      content: comment,
                      parentId: null,
                    })
                  );
                  setComment("");
                }
              }}
            >
              <img src={ArrowForwardUrl} />
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter className={""}>
        <Button
          className={"cursor-pointer"}
          onClick={() => {
            if (!title) {
              setError("Title is required");
            } else {
              const updatedItem: Item = {
                ...item!,
                title,
                description: description || "",
              };
              setError(null);
              dispatch(
                updateItem({ item: updatedItem, updatedParentId: parentColumn })
              );
              dispatch(toggleDialog());
            }
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ItemDialog;
