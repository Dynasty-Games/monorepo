import WalletConnect from "@walletconnect/client";
globalThis.WalletConnect = WalletConnect

const dispatchEvents = ({accounts, chainId}) => {
  document.dispatchEvent(new CustomEvent('accountsChange', {detail: accounts}))
  document.dispatchEvent(new CustomEvent('networkChange', {detail: chainId}))
}

const updateSession = (error, payload) => {
  error && console.error(error)

  payload.params[0] && dispatchEvents(payload.params[0])
}


globalThis.connector = {}


globalThis.walletConnect = {
  connect: async () => {
    const importee = await import('@walletconnect/qrcode-modal')
    connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      projectId: '1692ff8aa92069a0f6ff97e4a8e4ba37',
      qrcodeModal: importee.default
    });

    !connector.connected && connector.createSession();

    connector.connected && connector.accounts.length > 0 && dispatchEvents({
      accounts: connector.accounts,
      chainId: connector.chainId
    })

    connector.on("connect", updateSession);

    connector.on("session_update", updateSession);

    connector.on("disconnect", (error, payload) => {
      updateSession(error, payload)

      connector = undefined
    });
  },
  disconnect: () => connector.killSession()
}
