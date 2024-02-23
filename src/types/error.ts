export interface FetchError {
  status: number;
  data?: { status: string; message: string };
}
