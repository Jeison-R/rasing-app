import axios from 'axios'

import { getCookie } from '@/utils/cookies'

import { Methods, type Configuration, type Response, type ResponseData } from './verbs-utils'

const path = process.env.NEXT_PUBLIC_BACKEND_URL

const baseHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

const createConfigurations = <Data>(url: string, params: Record<string, unknown>, body: Data | undefined, headers: Record<string, string>, method: Methods): Configuration<Data> => {
  const newHeaders = { ...baseHeaders, ...headers }
  const queryParams = new URLSearchParams(params as Record<string, string>).toString()
  const token = getCookie('access-token').value

  return {
    method: method,
    url: path ? `${path}/${url}?${queryParams}` : `${url}?${queryParams}`,
    headers: {
      ...newHeaders,
      // type-coverage:ignore-next-line
      Authorization: `Bearer ${token ?? ''}`
    },
    data: body
  }
}

export const get = async <Data>(endpoint: string, params?: Record<string, unknown>, headers: Record<string, string> = {}): Promise<ResponseData<Response<Data | undefined>>> => {
  const configuration = createConfigurations(endpoint, params ?? {}, undefined, headers, Methods.Get)

  try {
    const response = await axios<Response<Data | undefined>>(configuration)

    const data = response.data

    return [data, null]
  } catch (error) {
    return [null, error]
  }
}

export const post = async <Data>(
  url: string,
  params?: Record<string, unknown>,
  body?: Record<string, unknown> | FormData,
  headers: Record<string, string> = {}
): Promise<ResponseData<Response<Data | undefined>>> => {
  const configuration = createConfigurations(url, params ?? {}, body, headers, Methods.Post)

  try {
    const response = await axios<Response<Data>>(configuration)

    const data = response.data

    return [data, null]
  } catch (error) {
    return [null, error]
  }
}

export const put = async <Data>(
  url: string,
  params?: Record<string, unknown>,
  body?: Record<string, unknown>,
  headers: Record<string, string> = {}
): Promise<ResponseData<Response<Data | undefined>>> => {
  const configuration = createConfigurations(url, params ?? {}, body, headers, Methods.Put)

  try {
    const response = await axios<Response<Data>>(configuration)

    const data = response.data

    return [data, null]
  } catch (error) {
    return [null, error]
  }
}

export const patch = async <Data>(
  url: string,
  params?: Record<string, unknown>,
  body?: Record<string, unknown>,
  headers: Record<string, string> = {}
): Promise<ResponseData<Response<Data | undefined>>> => {
  const configuration = createConfigurations(url, params ?? {}, body, headers, Methods.Patch)

  try {
    const response = await axios<Response<Data>>(configuration)

    const data = response.data

    return [data, null]
  } catch (error) {
    return [null, error]
  }
}

export const remove = async <Data>(
  url: string,
  params?: Record<string, unknown>,
  body?: Record<string, unknown>,
  headers: Record<string, string> = {}
): Promise<ResponseData<Response<Data | undefined>>> => {
  const configuration = createConfigurations(url, params ?? {}, body ?? null, headers, Methods.Delete)

  try {
    const response = await axios<Response<Data>>(configuration)

    const data = response.data

    return [data, null]
  } catch (error) {
    return [null, error]
  }
}
