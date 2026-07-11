export interface SearchFormProps {
  query?: string;
  sort?: string;
  sortOrder?: "asc" | "desc";
  onSearch: (values: { query: string; sort: string; sortOrder: "asc" | "desc" }) => void;
  onReset: () => void;
}
