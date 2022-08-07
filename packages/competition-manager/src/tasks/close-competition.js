import { dynastyContest } from "../contracts";


export default async (category, styles, id, amounts, addresses) => {
  try {
    let tx = await dynastyContest.closeCompetition(category, styles, id, amounts, addresses)
    await tx.wait()
  } catch (e) {
    console.log(e);
    console.error(e.reason);
  }
  return
}
