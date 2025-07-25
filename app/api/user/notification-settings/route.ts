import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * API route para gerenciar configurações de notificação do usuário
 */

// GET - Buscar configurações do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        notificationSettings: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Se não existem configurações, criar com valores padrão
    if (!user.notificationSettings) {
      const defaultSettings = await db.userNotificationSettings.create({
        data: {
          userId: user.id,
          soundEnabled: true,
          soundVolume: 0.7,
          newOrderSound: true,
          readySound: true,
          urgentSound: true,
          cancelSound: true,
          showToasts: true,
          urgentHighlight: true,
          animateNew: true,
          showTimers: true,
          autoRefreshEnabled: true,
          refreshInterval: 30,
          warningThreshold: 15,
          criticalThreshold: 30
        }
      })

      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(user.notificationSettings)
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST/PUT - Atualizar configurações do usuário
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await req.json()

    // Validar dados de entrada
    const validatedSettings = {
      soundEnabled: Boolean(settings.soundEnabled),
      soundVolume: Math.max(0, Math.min(1, Number(settings.soundVolume) || 0.7)),
      newOrderSound: Boolean(settings.newOrderSound),
      readySound: Boolean(settings.readySound),
      urgentSound: Boolean(settings.urgentSound),
      cancelSound: Boolean(settings.cancelSound),
      showToasts: Boolean(settings.showToasts),
      urgentHighlight: Boolean(settings.urgentHighlight),
      animateNew: Boolean(settings.animateNew),
      showTimers: Boolean(settings.showTimers),
      autoRefreshEnabled: Boolean(settings.autoRefreshEnabled),
      refreshInterval: Math.max(10, Math.min(300, Number(settings.refreshInterval) || 30)),
      warningThreshold: Math.max(5, Math.min(60, Number(settings.warningThreshold) || 15)),
      criticalThreshold: Math.max(10, Math.min(120, Number(settings.criticalThreshold) || 30))
    }

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Atualizar ou criar configurações
    const updatedSettings = await db.userNotificationSettings.upsert({
      where: { userId: user.id },
      update: validatedSettings,
      create: {
        userId: user.id,
        ...validatedSettings
      }
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Resetar configurações para padrão
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Resetar para configurações padrão
    const defaultSettings = await db.userNotificationSettings.upsert({
      where: { userId: user.id },
      update: {
        soundEnabled: true,
        soundVolume: 0.7,
        newOrderSound: true,
        readySound: true,
        urgentSound: true,
        cancelSound: true,
        showToasts: true,
        urgentHighlight: true,
        animateNew: true,
        showTimers: true,
        autoRefreshEnabled: true,
        refreshInterval: 30,
        warningThreshold: 15,
        criticalThreshold: 30
      },
      create: {
        userId: user.id,
        soundEnabled: true,
        soundVolume: 0.7,
        newOrderSound: true,
        readySound: true,
        urgentSound: true,
        cancelSound: true,
        showToasts: true,
        urgentHighlight: true,
        animateNew: true,
        showTimers: true,
        autoRefreshEnabled: true,
        refreshInterval: 30,
        warningThreshold: 15,
        criticalThreshold: 30
      }
    })

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Error resetting notification settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}