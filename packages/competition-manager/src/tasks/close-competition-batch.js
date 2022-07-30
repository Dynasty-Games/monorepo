import { dynastyContest } from "../contracts";


export default async ({categories, styles, ids, amounts, addresses, tokenId}) => {
  try {
    let tx = await dynastyContest.closeCompetitionBatch(categories, styles, ids, amounts, addresses, tokenId)
    await tx.wait()
  } catch (e) {
    console.log(e);
    console.error(e.reason);
  }
  return
}
