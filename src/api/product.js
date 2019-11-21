/*eslint-disable*/

import httpClient from './httpClient'
const { get: GET, post: POST } = httpClient

// outlet products
export const getOutletProducts = (parameters) => {
  return GET('/api/pos/auth/outletProducts', { params: { ...parameters } })
}

// stock products
export const updateStockQuantity = (parameters) => {
  return POST('api/pos/auth/updateStockQuantity', { ...parameters })
}

//add products
export const addProducts = (parameters) => {
  return POST('/api/pos/auth/add-product', parameters)
}

