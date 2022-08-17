import { calculateBaseSalary } from "../../lib/src/lib";
import { currencies } from "../../utils/src/utils";
import { competition } from "./api";

export const getCompetitionData = async ({category, style, id}) => {
  let params = await competition(category, style, id)
    console.log(params);

    let query = 'limit=250&pages=10'

    if (params.extraData?.query?.minMarketcap) {
      query += query.length > 0 ? `&maxMarketcap=${params.extraData.query.minMarketcap}` : `maxMarketcap=${params.extraData.query.minMarketcap}`
    }

    if (params.extraData?.query?.maxMarketcap) {
      query += query.length > 0 ? `&maxMarketcap=${params.extraData.query.maxMarketcap}` : `maxMarketcap=${params.extraData.query.minMarketcap}`
    }

    if (params.extraData?.query?.volume) {
      query += query.length > 0 ? `&minVolume=${params.extraData.query.volume}` : `minVolume=${params.extraData.query.volume}`
    }

    console.log(query);
    let items = await currencies(query)
    items = items.sort((a,b) => a.rank - b.rank)
    const rankById = []

    for (const item of items) {
      rankById.push(item.id)
    }

    if (params.extraData?.query?.items) {
      items = items.slice(0, params.extraData?.query?.items)
    }

    const max = params.extraData?.salary?.max || 9000
    const min = params.extraData?.salary?.min || 1000
    const maxSalary = params.extraData?.maxSalary || 50000

    return {
      params,
      items: calculateBaseSalary(items, min, max),
      maxSalary,
      rankById
    }
}