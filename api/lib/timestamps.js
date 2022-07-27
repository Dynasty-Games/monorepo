globalThis.__timestamps__ = globalThis.__timestamps__ || {}

export const add = (key, value) => {
  __timestamps__[key] = value
}

export const get = key => {
  return __timestamps__[key]
}

export const remove = (key) => {
  delete __timestamps__[key]
}

export default {
  add,
  get,
  remove
}
