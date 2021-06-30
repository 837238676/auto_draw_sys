import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/get_users_task',
    method: 'get',
    params
  })
}

export function downFile(params) {
  return request({
    url: '/api/get_task_output',
    method: 'get',
    params
  })
}

export function getDistricts(params) {
  return request({
    url: '/api/get_districts',
    method: 'get',
    params
  })
}

export function createTask(data) {
  return request({
    url: '/api/create_task',
    method: 'post',
    data
  })
}

export function delTask(params) {
  return request({
    url: '/api/user_task',
    method: 'delete',
    params
  })
}
