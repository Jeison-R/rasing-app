export interface Response<Data> {
  data?: Data
  status: ResponseType | null
  statusCode?: number | string
  message?: ErrorMessage
}

export type MethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ErrorMessage = string | null

export type ResponseData<Data> = [Data | undefined | null, unknown]

export interface Configuration<Data> {
  url: string
  data: Data | undefined
  headers: Record<string, string>
  method: Methods
}

export enum ResponseType {
  Ok = 'OK',
  Error = 'ERROR'
}

export enum Methods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE'
}
