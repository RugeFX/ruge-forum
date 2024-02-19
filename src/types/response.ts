export interface BaseResponse<TData> {
  status: 'success' | 'fail';
  message: string;
  data: TData;
}
