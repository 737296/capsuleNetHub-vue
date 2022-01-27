
export function setUTF8Item (key, payload) {
  sessionStorage.setItem(key, JSON.stringify(payload))
}

export function getUTF8Item (key) {
  return JSON.parse(sessionStorage.getItem(key))
}
