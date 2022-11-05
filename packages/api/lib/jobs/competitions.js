import cache from './../cache.js'
import competitions from './../fetchers/competitions'

export default async () => {
  const data = await competitions()
  const categories = [...data.categories]
  const styles = [...data.styles]
  const names = [...data.names]
  const openNames = [...data.openNames]
  const liveNames = [...data.liveNames]
  cache.add('info', {categories, styles, names, openNames, liveNames})
  
  delete data.styles
  delete data.categories
  delete data.openNames
  delete data.names
  delete data.liveNames
  cache.add('competitions', data)
}
