/*eslint-disable*/

import httpClient from './httpClient'

const { get: GET, post: POST } = httpClient

export const updateUser = data => {
  return POST('api/pos/auth/updateUser', data)
}