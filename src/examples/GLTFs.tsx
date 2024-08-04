import React, { useEffect } from 'react'

import { getComponent, setComponent } from '@etherealengine/ecs/src/ComponentFunctions'
import { getMutableState, getState } from '@etherealengine/hyperflux'

import { Engine, EntityUUID, UUIDComponent, createEntity, removeEntity } from '@etherealengine/ecs'

import { GLTFAssetState } from '@etherealengine/engine/src/gltf/GLTFState'
import { DirectionalLightComponent, TransformComponent } from '@etherealengine/spatial'
import { EngineState } from '@etherealengine/spatial/src/EngineState'
import { CameraComponent } from '@etherealengine/spatial/src/camera/components/CameraComponent'
import { CameraOrbitComponent } from '@etherealengine/spatial/src/camera/components/CameraOrbitComponent'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { InputComponent } from '@etherealengine/spatial/src/input/components/InputComponent'
import { RendererState } from '@etherealengine/spatial/src/renderer/RendererState'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { EntityTreeComponent } from '@etherealengine/spatial/src/transform/components/EntityTree'
import { Color, Euler, Quaternion } from 'three'
import { RouteData } from '../sceneRoute'

export const metadata = {
  title: 'GLTF',
  description: ''
}

const CDN_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/'

export const gltfRoutes = [
  {
    name: 'Basic',
    description: 'Basic Duck',
    entry: () => <GLTFViewer src={CDN_URL + '/Duck/glTF/Duck.gltf'} />
  },
  {
    name: 'Binary',
    description: 'Binary Duck',
    entry: () => <GLTFViewer src={CDN_URL + '/Duck/glTF-Binary/Duck.glb'} />
  },
  {
    name: 'Draco',
    description: 'Draco Duck',
    entry: () => <GLTFViewer src={CDN_URL + '/Duck/glTF-Draco/Duck.gltf'} />
  },
  {
    name: 'Embedded',
    description: 'Embedded Duck',
    entry: () => <GLTFViewer src={CDN_URL + '/Duck/glTF-Embedded/Duck.gltf'} />
  },
  {
    name: 'Quantized',
    description: 'Quantized Duck',
    entry: () => <GLTFViewer src={CDN_URL + '/Duck/glTF-Quantized/Duck.gltf'} />
  },
  {
    name: 'KHR_materials_unlit',
    description: 'Khronos Unlit Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/UnlitTest/glTF/UnlitTest.gltf'} />
  },
  {
    name: 'KHR_materials_emissive_strength',
    description: 'Khronos Emissive Strength Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/EmissiveStrengthTest/glTF/EmissiveStrengthTest.gltf'} />
  },
  {
    name: 'KHR_materials_clearcoat',
    description: 'Khronos Clearcoat Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/ClearCoatTest/glTF/ClearCoatTest.gltf'} />
  },
  {
    name: 'KHR_materials_iridescence',
    description: 'Khronos Iridescence Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/IridescenceMetallicSpheres/glTF/IridescenceMetallicSpheres.gltf'} />
  },
  {
    name: 'KHR_materials_sheen',
    description: 'Khronos Sheen Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/SheenChair/glTF/SheenChair.gltf'} />
  },
  {
    name: 'KHR_materials_transmission',
    description: 'Khronos Transmission Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/TransmissionTest/glTF/TransmissionTest.gltf'} />
  },
  {
    name: 'KHR_materials_volume',
    description: 'Khronos Volume Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/AttenuationTest/glTF/AttenuationTest.gltf'} />
  },
  // {
  //   name: 'KHR_materials_ior',
  //   description: 'Khronos Index of Refraction Material Extension',
  //   entry: () => <GLTFViewer src={CDN_URL + '/IORTest/glTF/IORTest.gltf'} />
  // },
  {
    name: 'KHR_materials_specular',
    description: 'Khronos Specular Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/SpecularTest/glTF/SpecularTest.gltf'} />
  },
  // {
  //   name: 'EXT_materials_bump',
  //   description: 'Khronos Bump Material Extension',
  //   entry: () => <GLTFViewer src={CDN_URL + '/BumpTest/glTF/BumpTest.gltf'} />
  // },
  {
    name: 'KHR_materials_anisotropy',
    description: 'Khronos Anisotropy Material Extension',
    entry: () => <GLTFViewer src={CDN_URL + '/CarbonFibre/glTF/CarbonFibre.gltf'} />
  }
] as RouteData[]

export default function GLTFViewer(props: { src: string }) {
  useEffect(() => {
    const bgColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = 'gray'
    getMutableState(RendererState).gridVisibility.set(true)
    getMutableState(RendererState).physicsDebug.set(true)
    const entity = Engine.instance.viewerEntity
    setComponent(entity, CameraOrbitComponent)
    setComponent(entity, InputComponent)
    getComponent(entity, CameraComponent).position.set(0, 3, 4)

    return () => {
      document.body.style.backgroundColor = bgColor
    }
  }, [])

  useEffect(() => {
    const entity = createEntity()
    setComponent(entity, UUIDComponent, 'directional light' as EntityUUID)
    setComponent(entity, NameComponent, 'Directional Light')
    setComponent(entity, TransformComponent, { rotation: new Quaternion().setFromEuler(new Euler(2, 5, 3)) })
    setComponent(entity, EntityTreeComponent, { parentEntity: getState(EngineState).originEntity })
    setComponent(entity, VisibleComponent, true)
    setComponent(entity, DirectionalLightComponent, { color: new Color('white'), intensity: 1 })

    const ret = GLTFAssetState.loadScene(props.src, props.src)
    return () => {
      removeEntity(entity)
      ret()
    }
  }, [props.src])

  return null
}
