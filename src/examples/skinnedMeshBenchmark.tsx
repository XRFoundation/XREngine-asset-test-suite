import React, { useEffect } from 'react'

import { EngineState } from '@etherealengine/spatial/src/EngineState'
import { getMutableState } from '@etherealengine/hyperflux'

import { useWorldNetwork } from '@etherealengine/client-core/src/common/services/LocationInstanceConnectionService'
import { useFind } from '@etherealengine/spatial/src/common/functions/FeathersHooks'
import { avatarPath } from '@etherealengine/common/src/schemas/user/avatar.schema'
import { CreateSkinnedMeshGrid } from './utils/avatar/loadAvatarHelpers'
import { Template } from './utils/template'
import { AnimationState } from '@etherealengine/engine/src/avatar/AnimationManager'

export default function AvatarBenchmarking() {
  const network = useWorldNetwork()
  const avatarList = useFind(avatarPath, {
    query: {
      $skip: 0,
      $limit: 100
    }
  })

  useEffect(() => {
    getMutableState(AnimationState).avatarLoadingEffect.set(false)
  }, [])

  useEffect(() => {
    if (network?.ready.value && avatarList.data.length > 0) {
      CreateSkinnedMeshGrid([...avatarList.data], 64)
    }
  }, [network?.ready, avatarList.data.length])

  return <Template />
}
