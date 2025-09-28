"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Keyboard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: "← →", description: "Navigate between questions" },
    { key: "Enter", description: "Submit quiz (on last question)" },
    { key: "1-4", description: "Select answer options A-D" },
    { key: "Esc", description: "Close this help dialog" },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 shadow-lg"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    <CardTitle>Keyboard Shortcuts</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close help dialog">
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">{shortcut.key}</kbd>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
