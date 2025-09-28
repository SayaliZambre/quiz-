"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your quiz assistant. I can help you with questions about the quiz, provide hints, or just chat while you take your time!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("hint") || lowerMessage.includes("help")) {
      return "Here's a tip: Read each question carefully and eliminate obviously wrong answers first. Take your time - you have 10 minutes total!"
    }

    if (lowerMessage.includes("time") || lowerMessage.includes("timer")) {
      return "You can see your remaining time at the top of the quiz. Don't worry too much about it - focus on accuracy over speed!"
    }

    if (lowerMessage.includes("score") || lowerMessage.includes("result")) {
      return "Your score will be calculated when you submit the quiz. You'll see detailed results showing which questions you got right or wrong!"
    }

    if (lowerMessage.includes("nervous") || lowerMessage.includes("worried") || lowerMessage.includes("anxious")) {
      return "It's normal to feel nervous! Remember, this is just a quiz. Take deep breaths and trust your knowledge. You've got this! 💪"
    }

    if (lowerMessage.includes("question") && lowerMessage.includes("difficult")) {
      return "If you're stuck on a question, try eliminating the answers you know are wrong first. Sometimes the process of elimination helps!"
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help you with your quiz today? Need any tips or just want to chat?"
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! I'm here whenever you need assistance. Good luck with your quiz!"
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! How are you finding the quiz so far?",
      "I'm here to help! Is there anything specific about the quiz you'd like to know?",
      "Keep going! You're doing great. Remember to read each question carefully.",
      "Feel free to ask me for hints or tips if you need them!",
      "Take your time and trust your instincts. You've got this!",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateBotResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // 1-2 seconds delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">Quiz Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-white hover:bg-purple-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-80">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {message.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
