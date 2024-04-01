export type APIResponseType<T> = {
  data: T;
  message: string;
  status: boolean;
};
