import { Venue } from "@/types/venue";

export interface FetchVenuesProps {
  showGrid?: boolean;
  limit?: number;
  enableLoadMore?: boolean;
  query?: string;
  sort?: string;
  sortOrder?: "asc" | "desc";
  venues?: Venue[];
  loading?: boolean;
  error?: Error | null;
}
