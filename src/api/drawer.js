/*eslint-disable*/

import httpClient from './httpClient'

const { get: GET, post: POST } = httpClient

export const getDrawerDetail = usrID => {
    return POST('api/pos/auth/getDrawerDetails', { user_id: usrID })
}

export const updateDrawer = (params) => {
    return POST('api/pos/auth/updateDrawer', { ...params })
}

export const openDrawer = (params) => {
    return POST('api/pos/auth/openDrawer', { ...params })
}

