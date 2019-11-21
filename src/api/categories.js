import httpClient from './httpClient'

const { get: GET, post: POST } = httpClient

export const getCategories = () => {
    return GET('/api/pos/categories')
}

export const productCategories = (page, user_id, outlet_id) => {
    return POST('/api/pos/auth/productCategories', { page, user_id, outlet_id })
}