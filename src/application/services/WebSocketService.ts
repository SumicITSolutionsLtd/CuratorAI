import { io, Socket } from 'socket.io-client'

export type WebSocketEvent =
  | 'notification'
  | 'new_recommendation'
  | 'post_liked'
  | 'new_comment'
  | 'new_follower'
  | 'processing_complete'

export class WebSocketService {
  private socket: Socket | null = null
  private eventHandlers: Map<WebSocketEvent, Set<(data: any) => void>> = new Map()

  connect(url: string, token: string): void {
    if (this.socket?.connected) {
      return
    }

    this.socket = io(url, {
      auth: {
        token,
      },
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    // Register event listeners
    this.eventHandlers.forEach((handlers, event) => {
      this.socket?.on(event, (data) => {
        handlers.forEach((handler) => handler(data))
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: WebSocketEvent, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)

    if (this.socket) {
      this.socket.on(event, handler)
    }
  }

  off(event: WebSocketEvent, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.delete(handler)
      if (this.socket) {
        this.socket.off(event, handler)
      }
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

export const webSocketService = new WebSocketService()
