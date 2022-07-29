import { providers } from './../../node_modules/ethers/dist/ethers.esm'

export default async (walletProvider = 'metamask') => {
  if (walletProvider === 'walletConnect') {
    if (!globalThis.walletConnect) await import(/* webpackChunkName: "walletConnect" */ './../walletconnect/walletconnect.js')
    await walletConnect.connect()
  } else if (walletProvider === 'metamask') {
    const provider = new providers.Web3Provider(globalThis.ethereum, 'any');
    // Prompt user for account connections
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    globalThis.connector = signer
    const address = await signer.getAddress()
    globalThis.connector.accounts = [address]
    document.dispatchEvent(new CustomEvent('accountsChange', {detail: [address]}))
    // document.dispatchEvent(new CustomEvent('networkChange', {detail: chainId}))
  }


}
