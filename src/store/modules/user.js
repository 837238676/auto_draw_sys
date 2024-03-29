import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUsername } from '@/utils/auth'
import { resetRouter } from '@/router'
import avatar_demo from '../../assets/avatar.jpg'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: avatar_demo
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, grant_type } = userInfo
    let formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)
    formData.append('grant_type', grant_type)
    return new Promise((resolve, reject) => {
      login(formData).then(response => {
        setUsername(username)
        commit('SET_TOKEN', response.access_token)
        setToken(response.access_token)
        resolve()

      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

