/*eslint-disable*/

import httpClient from './httpClient'

const { get: GET, post: POST } = httpClient

export const config = () => {
  return GET('/api/pos/config')
}

export const navMenus = () => {
  return GET('/api/pos/navmenus')
}