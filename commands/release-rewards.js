import { createContract } from '../index.js'
import { relative, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pRetry from 'p-retry'

export const releaseRewards = async opts => {
  const { contractWithSigner } = await createContract(opts)
  console.error('Please sign on your ledger...')
  const tx = await contractWithSigner.releaseRewards()
  console.log(tx.hash)
  console.log('Awaiting confirmation...')
  await pRetry(() => tx.wait())
  console.log('Rewards released')

  const bin = relative(
    process.cwd(),
    fileURLToPath(new URL('.', import.meta.url))
  )
  console.log('For progress, check')
  console.log()
  console.log(`  $ node ${join(bin, 'participant-count-scheduled-for-transfer.js')}`)
  console.log()
  console.log(`  $ node ${join(bin, 'scheduled-for-transfer.js')}`)
  console.log()
  process.exit()
}
