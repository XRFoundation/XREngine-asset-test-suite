// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthService } from '@etherealengine/client-core/src/user/services/AuthService'
import { matchUserPath } from '@etherealengine/common/src/schemas/matchmaking/match-user.schema'
import { Engine } from '@etherealengine/ecs/src/Engine'
import { OpenMatchTicketAssignment } from '@etherealengine/matchmaking/src/interfaces'
import { matchTicketAssignmentPath } from '@etherealengine/matchmaking/src/match-ticket-assignment.schema'
import { matchTicketPath } from '@etherealengine/matchmaking/src/match-ticket.schema'

const Page = () => {
  const [renderTrigger, updRenderTrigger] = useState<object>()
  const [ticketsIds, setTicketsIds] = useState<string[]>([])
  const connections = useRef<Record<string, string>>({})

  console.log('RENDER', ticketsIds, connections)

  useEffect(() => {
    AuthService.doLoginAuto()
  }, [])

  async function newTicket() {
    let ticket
    try {
      ticket = await Engine.instance.api.service(matchTicketPath).create({ gamemode: 'mode.demo' })
    } catch (e) {
      alert('You already searching for game')
      const matchUser = (await Engine.instance.api.service(matchUserPath).find()).data[0]
      console.log('matchUser', matchUser)
      ticket = { id: matchUser.ticketId }
    }
    console.log('ticket', ticket)
    if (ticketsIds.includes(ticket.id)) {
      return
    }
    setTicketsIds([...ticketsIds, ticket.id])

    getAssignment(ticket.id).then((assignment) => {})
  }

  function addConnection(key, value) {
    console.log('addConnection', connections, key, value)
    return {
      ...connections,
      [key]: value
    }
  }

  function getAssignment(ticketId: string): Promise<OpenMatchTicketAssignment> {
    return (
      Engine.instance.api.service(matchTicketAssignmentPath).get(ticketId) as Promise<OpenMatchTicketAssignment>
    ).then((assignment) => {
      console.log('assignment', ticketId, assignment)
      connections.current[ticketId] = assignment.connection
      updRenderTrigger({})
      return assignment
    })
  }

  const ticketsTable = !ticketsIds.length
    ? null
    : ticketsIds.map((id) => {
        const locationName = connections.current[id]
        const status = locationName ? (
          <>
            ...game found! connection link: <Link to={'/location/' + locationName}>locationName</Link>
          </>
        ) : (
          '...waiting...'
        )
        return (
          <tr key={id}>
            <td>Player id:{id}</td>
            <td>{status}</td>
          </tr>
        )
      })

  // console.log('ticketsTable', ticketsTable)

  return (
    <div style={{ backgroundColor: 'black', margin: '10px' }}>
      <button onClick={() => newTicket()}>Find game (as new player)</button>
      <div>
        Players in queue:
        <table>
          <tbody>{ticketsTable}</tbody>
        </table>
      </div>
    </div>
  )
}

export default Page
