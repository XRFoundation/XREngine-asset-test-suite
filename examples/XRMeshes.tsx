import React, { useEffect } from 'react'
import { BufferGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial } from 'three'

import { setComponent, useComponent } from '@etherealengine/ecs/src/ComponentFunctions'
import { useEntityContext } from '@etherealengine/ecs/src/EntityFunctions'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { addObjectToGroup, removeObjectFromGroup } from '@etherealengine/spatial/src/renderer/components/GroupComponent'

import { QueryReactor } from '@etherealengine/ecs/src/QueryFunctions'
import { XRDetectedMeshComponent } from '@etherealengine/spatial/src/xr/XRDetectedMeshComponent'
import { XRDetectedPlaneComponent } from '@etherealengine/spatial/src/xr/XRDetectedPlaneComponent'
import { Template } from './utils/template'

const wireframeMaterial = new MeshBasicMaterial({ wireframe: true })
const normalMaterial = new MeshNormalMaterial({ opacity: 0.5, transparent: true })

export const DetectedPlanes = () => {
  const entity = useEntityContext()

  const xrPlane = useComponent(entity, XRDetectedPlaneComponent)

  useEffect(() => {
    if (!xrPlane.geometry.value) return
    const transparentMesh = new Mesh(xrPlane.geometry.value as BufferGeometry, normalMaterial)
    addObjectToGroup(entity, transparentMesh)
    setComponent(
      entity,
      NameComponent,
      'Plane ' + (xrPlane.plane.value.semanticLabel ?? xrPlane.plane.orientation.value)
    )
    return () => {
      removeObjectFromGroup(entity, transparentMesh)
    }
  }, [xrPlane.geometry])

  return null
}

export const DetectedMeshes = () => {
  const entity = useEntityContext()

  const xrmesh = useComponent(entity, XRDetectedMeshComponent)

  useEffect(() => {
    if (!xrmesh.geometry.value) return
    const outlineMesh = new Mesh(xrmesh.geometry.value as BufferGeometry, wireframeMaterial)
    addObjectToGroup(entity, outlineMesh)
    setComponent(entity, NameComponent, 'Plane ' + (xrmesh.mesh.value.semanticLabel ?? entity))
    return () => {
      removeObjectFromGroup(entity, outlineMesh)
    }
  }, [xrmesh.geometry])

  return null
}

export default function XRMeshes() {
  return (
    <>
      <Template />
      <QueryReactor Components={[XRDetectedPlaneComponent]} ChildEntityReactor={DetectedPlanes} />
      <QueryReactor Components={[XRDetectedMeshComponent]} ChildEntityReactor={DetectedMeshes} />
    </>
  )
}
