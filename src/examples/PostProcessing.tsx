import React, { useEffect } from 'react'

import { getMutableState, useHookstate } from '@etherealengine/hyperflux'

import { LocationIcons } from '@etherealengine/client-core/src/components/LocationIcons'
import { useQuery } from '@etherealengine/ecs'
import { getComponent, updateComponent } from '@etherealengine/ecs/src/ComponentFunctions'
import { Entity } from '@etherealengine/ecs/src/Entity'
import { PostProcessingSettingsEditor } from '@etherealengine/editor/src/components/properties/PostProcessingSettingsEditor'
import { EditorControlFunctions } from '@etherealengine/editor/src/functions/EditorControlFunctions'
import { SelectionState } from '@etherealengine/editor/src/services/SelectionServices'
import { UUIDComponent } from '@etherealengine/ecs'
import { useSearchParams } from 'react-router-dom'
import { Template } from './utils/template'
import { PostProcessingComponent } from '@etherealengine/spatial/src/renderer/components/PostProcessingComponent'

export default function PostProcessing() {
  const entity = useHookstate<Entity | null>(null)
  const [params] = useSearchParams()
  const sceneName = params.get('sceneName')!
  const projectName = params.get('projectName')!
  const postProEnt = useQuery([PostProcessingComponent])

  useEffect(() => {
    if (!postProEnt.length) return
    entity.set(postProEnt[0])
    EditorControlFunctions.modifyProperty = (entities, component, properties) => {
      updateComponent(entity.value!, PostProcessingComponent, properties)
    }
    getMutableState(SelectionState).selectedEntities.set([getComponent(entity.value!, UUIDComponent)])
  }, [postProEnt])

  return (
    <>
      <Template sceneName={sceneName} projectName={projectName} />
      <LocationIcons />
      <div
        style={{
          pointerEvents: 'all',
          position: 'absolute',
          top: '10%',
          left: '70%',
          background: 'white',
          overflowY: 'auto',
          height: '80%'
        }}
      >
        {entity.value && <PostProcessingSettingsEditor entity={entity.value} component={PostProcessingComponent} />}
      </div>
    </>
  )
}
