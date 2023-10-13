import assert from 'assert'
import { Vector3 } from 'three'
import { EtherealEngineBot } from 'ee-bot/src/bot/bot-class'
import { BotHooks } from 'ee-bot/src/enums/BotHooks'

const vector3 = new Vector3()

//const domain = process.env.APP_HOST
const domain = 'localhost:3000'
const locationName = 'default'
const sqrt2 = Math.sqrt(2)

describe('My Bot Tests', () => {
  const bot = new EtherealEngineBot({ name: 'bot', headless:false, verbose: true })
  before(async () => {
    await bot.launchBrowser()
    await bot.enterLocation(`https://${domain}/location/${locationName}`)
    await bot.awaitHookPromise(BotHooks.LocationLoaded)
    await bot.enableCameraForMotionCapture()
  })

  after(async () => {
    await bot.quit()
  })

  it('Can spawn in the world', async () => {
    const pos = await bot.awaitHookPromise(BotHooks.GetPlayerPosition)
  })
})

