/*
Elimina este archivo.
*/

import { get } from './verbs'

export const findTodos = async () => {
  const [data, error] = await get('https://jsonplaceholder.typicode.com/todos/1')

  if (error) {
    // Maneja el error como gustes 😉
    return [null, error]
  }

  return [data, null]
}
