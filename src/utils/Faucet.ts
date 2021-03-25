export default {
  async requestTokens(address: string) {
    const data = {
      address,
      network: "mumbai",
      token: "maticToken"
    }

    const response = await fetch(
      'https://api.faucet.matic.network/transferTokens',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )

    return response.json()
  }
}