import httpClient from './httpClient'

const { get: GET, post: POST } = httpClient

export const getOrders = (parameters) => {
    return GET('api/pos/auth/getOrders', { params: parameters } )
}

export const addOrder = (order, posData) => {
    return POST('api/pos/auth/addOrder', {
        order_data: order,
        pos_data: posData
    })
}
