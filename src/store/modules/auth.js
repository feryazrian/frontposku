import { isLogin, logout } from '@/api/auth'
import router from '@/router'

const state = {
  tokenAuth: null,
}

const getters = {
  getToken(state) {
    return state.tokenAuth;
  }
}

const mutations = {
  setToken(state, token) {
    state.tokenAuth = token
  },
  clearToken(state) {
    state.tokenAuth = null
  }
}

const actions = {
  login({ commit }, authData) { 
    commit('setToken', authData)
    localStorage.setItem('token', authData.access_token)
    // localStorage.setItem('tokenType', authData.token_type)
  },
  autoLogin({ commit }) {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    isLogin().then(res => {
      if (!res.data.status && res.data.route) {
        console.log(res.data.route)
        router.push({ name: res.data.route })
      }
      else if (res.data.status && res.data.route) {
        commit('setToken', token)
        router.push({ name: res.data.route })
      }
    }).catch( e => {
      console.error(e)
    })
  },
  logout({ commit }) {
    logout()
      .then(res => {
        if (res.data.route) {
          commit('clearToken')
          localStorage.removeItem('token')
          router.push({ name: res.data.route })
        }
      })
      .catch(e => console.error(e))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
