import type { FastifyRequest, FastifyReply } from 'fastify'

import * as notificationService from './service.js'

export async function getMyNotifications(request: FastifyRequest, reply: FastifyReply) {
  const result = await notificationService.getNotifications(request.user.id)
  return reply.send(result)
}

export async function markRead(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await notificationService.markRead(request.params.id, request.user.id)
  return reply.send({ ok: true })
}

export async function markAllRead(request: FastifyRequest, reply: FastifyReply) {
  await notificationService.markAllRead(request.user.id)
  return reply.send({ ok: true })
}
