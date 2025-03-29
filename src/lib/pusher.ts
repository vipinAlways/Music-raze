"use client"
import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID ?? '',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '',
  secret: process.env.PUSHER_APP_SECRET ?? '',
  cluster: 'ap2',
  useTLS: true,
})

if (!process.env.PUSHER_APP_ID || !process.env.NEXT_PUBLIC_PUSHER_APP_KEY || !process.env.PUSHER_APP_SECRET) {
  console.log(process.env.PUSHER_APP_ID, process.env.NEXT_PUBLIC_PUSHER_APP_KEY, process.env.PUSHER_APP_SECRET)   ;
  throw new Error('Pusher environment variables are missing.')
}

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "",
  {
    cluster: 'ap2',
  }
)
