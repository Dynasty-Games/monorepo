export default async competition => {
  try {
    let tx = await competition.contract.mgrCloseForNewEntries()
    await tx.wait()
  } catch (e) {
    console.error(e.reason);
  }
  return
}
