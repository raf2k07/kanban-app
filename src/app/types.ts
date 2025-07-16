export type Column = {
  id: string;
  name: string;
  items: Item[];
};

export type Item = {
  id: string;
  parentId: string;
  title: string;
  labels?: string[];
  description?: string;
};

export type Comment = {
  id: string;
  parentId: string | null;
  content: string;
  edited?: boolean;
};
