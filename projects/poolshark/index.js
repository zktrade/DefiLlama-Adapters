const { getLogs } = require('../helper/cache/getLogs')

const config = {
  arbitrum: { limitPoolFactory: '0x9F479560cd8A531E6C0fe04521Cb246264fE6b71', limitPoolFromBlock: 158133516 },
}

Object.keys(config).forEach(chain => {
  const { limitPoolFactory, limitPoolFromBlock, } = config[chain]
  module.exports[chain] = {
    tvl: async (_, _b, _cb, { api, }) => {
      const logs = await getLogs({
        api,
        target: limitPoolFactory,
        eventAbi: 'event PoolCreated(address pool, address token, address indexed token0, address indexed token1, uint16 indexed swapFee, int16 tickSpacing, uint16 poolTypeId)',
        onlyArgs: true,
        fromBlock: limitPoolFromBlock,
      })
      const ownerTokens = logs.map(log => [[log.token0, log.token1], log.pool])
      return api.sumTokens({ ownerTokens })
    }
  }
})