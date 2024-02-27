export type StandardResponse<Type> = {
  isError: boolean;
  message: string;
  data: Type;
};
