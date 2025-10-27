import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Square, Sparkles, User, Bot } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your AI fashion assistant. Tell me about the outfit you're looking for, or record a voice note to describe your style preferences!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === '') return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Based on your preferences, I recommend exploring our curated collection of elegant and comfortable outfits. Would you like me to show you some options?',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsProcessing(false)
    }, 1500)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        handleVoiceNote(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleVoiceNote = (audioBlob: Blob) => {
    // TODO: Send audio to speech-to-text API
    console.log('Audio blob size:', audioBlob.size)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: '[Voice Note] Looking for a casual outfit for a weekend brunch...',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'I heard you! For a weekend brunch, I suggest a comfortable yet stylish look. How about a flowy midi dress with sneakers or a casual blazer with jeans?',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsProcessing(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-brand-crimson to-brand-blue p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Sparkles className="h-5 w-5 text-brand-crimson" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Fashion Assistant</h3>
            <p className="text-xs text-white/80">Powered by CuratorAI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={
                    message.role === 'assistant'
                      ? 'bg-brand-crimson text-white'
                      : 'bg-brand-blue text-white'
                  }
                >
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-beige text-brand-charcoal'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-brand-crimson text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 rounded-2xl bg-brand-beige px-4 py-2">
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                  className="h-2 w-2 rounded-full bg-brand-crimson"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  className="h-2 w-2 rounded-full bg-brand-crimson"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                  className="h-2 w-2 rounded-full bg-brand-crimson"
                />
              </div>
              <span className="text-xs text-muted-foreground">AI is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-3 w-3 rounded-full bg-red-500"
            />
            <Badge variant="destructive" className="animate-pulse">
              Recording...
            </Badge>
          </motion.div>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice note..."
              className="pr-12"
              disabled={isRecording || isProcessing}
            />
          </div>

          {/* Voice Note Button */}
          <Button
            size="icon"
            variant={isRecording ? 'destructive' : 'outline'}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={isRecording ? 'animate-pulse' : ''}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Send Button */}
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={input.trim() === '' || isRecording || isProcessing}
            className="bg-brand-crimson hover:bg-brand-crimson/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isRecording
            ? 'Speak now... Click stop when finished'
            : 'Press Enter to send, or click the mic to record'}
        </p>
      </div>
    </Card>
  )
}
