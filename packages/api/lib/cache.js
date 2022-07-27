globalThis.__cache__ = globalThis.__cache__ || {}

export const add = (key, value) => {
  __cache__[key] = value
}

export const get = key => {
  return __cache__[key]
}

export const remove = (key) => {
  delete __cache__[key]
}

export default {
  add,
  get,
  remove
}
