'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  href: string
  label: string
}

export function FloatingActionButton({ href, label }: FloatingActionButtonProps) {
  return (
    <Link href={href}>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-green-600 hover:bg-green-700 z-50"
        title={label}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </Link>
  )
}