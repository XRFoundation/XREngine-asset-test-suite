import React, { useEffect } from 'react'
import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

import { MediaIconsBox } from '@etherealengine/client-core/src/components/MediaIconsBox'
import { Engine } from '@etherealengine/engine/src/ecs/classes/Engine'
import { XRLightProbeState } from '@etherealengine/engine/src/xr/XRLightProbeSystem'
import { getMutableState, useHookstate } from '@etherealengine/hyperflux'

import { useLocationSpawnAvatar } from '@etherealengine/client-core/src/components/World/EngineHooks'
import { Template } from './utils/template'

const LightProbe = () => {
  const xrLightProbeState = useHookstate(getMutableState(XRLightProbeState).environment)

  useEffect(() => {
    if (!xrLightProbeState.value) return

    // const entity = createEntity()

    const ballGeometry = new SphereGeometry(0.5, 32, 32)
    const ballMaterial = new MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0,
      metalness: 1
    })
    const ballMesh = new Mesh(ballGeometry, ballMaterial)

    Engine.instance.scene.add(ballMesh)
    // ballGroup.add(ballMesh);

    // const outlineMesh = new Mesh(isEstimatingLight.geometry.value, new MeshBasicMaterial({ wireframe: true }))
    // addObjectToGroup(entity, outlineMesh)
    // setComponent(entity, VisibleComponent)
    // setComponent(entity, NameComponent, 'Plane ' + isEstimatingLight.plane.orientation.value)
    return () => {
      // removeObjectFromGroup(entity, outlineMesh)
      // removeComponent(entity, VisibleComponent)
    }
  }, [xrLightProbeState])

  return null
}

export default function XRLightEstimation() {
  useLocationSpawnAvatar()
  return (
    <>
      <Template />
      <div style={{ pointerEvents: 'all' }}>
        <MediaIconsBox />
      </div>
      <LightProbe />
    </>
  )
}
