

export const minute = 1000 * 60
export const hour = 60 * minute
export const day = 24 * hour


export const calendar = (timestamp, showPast = true) => {
  const current = new Date().getTime()
  timestamp = isNaN(Number(timestamp)) ? timestamp.getTime() : Number(timestamp)
  const date = new Date(timestamp)
  let when
  let inThePast
  // if (current < timestamp) {
  //   if (timestamp - current > day) {
  //     when = 'Tomorrow at'
  //   } else if (timestamp - current < day) {
  //     when = 'Today at'
  //   } else if (timestamp - current > 2 * day) {
  //     when = undefined
  //   }
  // } else {
  //   inThePast = true
  //   if (current - timestamp > day) {
  //     when = 'started Yesterday at'
  //   } else if (current - timestamp < day) {
  //     when = 'Open since'
  //   } else {
  //     when = undefined
  //   }
  // }
  when = undefined
  let days = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  if (String(day).length === 1) days = `0${days}`
  if (String(hours).length === 1) hours = `0${hours}`
  if (String(minutes).length === 1) minutes = `0${minutes}`

  if (inThePast && !showPast) return ''
  return `${when ? when : `${days}/${date.getMonth() + 1}/${date.getFullYear()}`} ${hours}:${minutes}`
}
