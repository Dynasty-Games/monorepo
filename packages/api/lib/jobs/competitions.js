import cache from './../cache.js'
import competitions from './../fetchers/competitions'

export default async () => {
  const data = await competitions()
  const categories = [...data.categories]
  const styles = [...data.styles]
  cache.add('info', {categories, styles})
  
  delete data.styles
  delete data.categories
  cache.add('competitions', data)
}
