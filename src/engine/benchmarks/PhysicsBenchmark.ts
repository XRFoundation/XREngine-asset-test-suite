import {
  Engine,
  Entity,
  EntityUUID,
  UUIDComponent,
  createEntity,
  getComponent,
  removeEntity,
  setComponent
} from '@etherealengine/ecs'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'
import { TransformComponent } from '@etherealengine/spatial'
import { ColliderComponent } from '@etherealengine/spatial/src/physics/components/ColliderComponent'
import { RigidBodyComponent } from '@etherealengine/spatial/src/physics/components/RigidBodyComponent'
import { Object3DComponent } from '@etherealengine/spatial/src/renderer/components/Object3DComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { EntityTreeComponent } from '@etherealengine/spatial/src/transform/components/EntityTree'
import { useEffect } from 'react'
import { Group, MathUtils, Vector3 } from 'three'

const objectsToCreate = 60
const waitTimeBetween = 200
const simulateTime = 3000

const scale = new Vector3(0.5, 0.5, 0.5)

const createPhysicsEntity = (rootEntity: Entity) => {
  const entity = createEntity()

  const position = getComponent(Engine.instance.cameraEntity, TransformComponent).position.clone()
  position.setZ(position.z - 7.0)
  position.setX(position.x + MathUtils.randFloat(-2.0, 2.0))
  const obj3d = new Group()
  obj3d.entity = entity
  setComponent(entity, UUIDComponent, MathUtils.generateUUID() as EntityUUID)
  setComponent(entity, EntityTreeComponent, { parentEntity: rootEntity })
  setComponent(entity, Object3DComponent, obj3d)
  setComponent(entity, TransformComponent, { position, scale })
  setComponent(entity, PrimitiveGeometryComponent, {
    geometryType: GeometryTypeEnum.SphereGeometry,
    geometryParams: {
      radius: 1,
      widthSegments: 32,
      heightSegments: 16,
      phiStart: 0,
      phiLength: 6.283185307179586,
      thetaStart: 0,
      thetaLength: 3.141592653589793
    }
  })
  setComponent(entity, VisibleComponent, true)
  setComponent(entity, RigidBodyComponent, { type: 'dynamic' })
  setComponent(entity, ColliderComponent, {
    shape: 'sphere',
    mass: MathUtils.randFloat(0.5, 1.5),
    friction: MathUtils.randFloat(0.1, 1.0),
    restitution: MathUtils.randFloat(0.1, 1.0)
  })

  return entity
}

export const PhysicsBenchmark = (props: { rootEntity: Entity; onComplete: () => void }): null => {
  const { rootEntity, onComplete } = props

  useEffect(() => {
    if (!rootEntity) return

    let running = true
    const entities = [] as Entity[]
    let createdObjects = 0

    const spawnObject = () => {
      if (!running) return
      createdObjects += 1
      if (createdObjects <= objectsToCreate) {
        const entity = createPhysicsEntity(rootEntity)
        entities.push(entity)
        setTimeout(spawnObject, waitTimeBetween)
      } else {
        setTimeout(() => {
          onComplete()
        }, simulateTime)
      }
    }
    spawnObject()

    return () => {
      running = false
      for (const entity of entities) {
        removeEntity(entity)
      }
    }
  }, [rootEntity])

  return null
}
