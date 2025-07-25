'use client'

import { useState, useEffect, useCallback } from 'react'

// Interface para configurações de notificação do usuário
export interface UserNotificationSettings {
  id?: string
  userId?: string
  
  // Sound settings
  soundEnabled: boolean
  soundVolume: number
  newOrderSound: boolean
  readySound: boolean
  urgentSound: boolean
  cancelSound: boolean
  
  // Visual settings
  showToasts: boolean
  urgentHighlight: boolean
  animateNew: boolean
  showTimers: boolean
  
  // Auto refresh settings
  autoRefreshEnabled: boolean
  refreshInterval: number
  
  // Urgency thresholds
  warningThreshold: number
  criticalThreshold: number
  
  createdAt?: string
  updatedAt?: string
}

// Configurações padrão
const defaultSettings: UserNotificationSettings = {
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

// Hook para gerenciar configurações de notificação do usuário
export function useUserNotificationSettings() {
  const [settings, setSettings] = useState<UserNotificationSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Carregar configurações do servidor
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/user/notification-settings')
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado')
        }
        throw new Error('Erro ao carregar configurações')
      }

      const serverSettings = await response.json()
      setSettings(serverSettings)
    } catch (error) {
      console.error('Error loading notification settings:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      
      // Usar configurações do localStorage como fallback
      try {
        const localSettings = localStorage.getItem('notification-settings')
        if (localSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(localSettings) })
        }
      } catch (localError) {
        console.error('Error loading local settings:', localError)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salvar configurações no servidor
  const saveSettings = useCallback(async (newSettings: Partial<UserNotificationSettings>) => {
    try {
      setIsSaving(true)
      setError(null)

      const updatedSettings = { ...settings, ...newSettings }

      const response = await fetch('/api/user/notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações')
      }

      const savedSettings = await response.json()
      setSettings(savedSettings)
      setLastSaved(new Date())

      // Também salvar no localStorage como backup
      try {
        localStorage.setItem('notification-settings', JSON.stringify(savedSettings))
      } catch (localError) {
        console.error('Error saving to localStorage:', localError)
      }

      return savedSettings
    } catch (error) {
      console.error('Error saving notification settings:', error)
      setError(error instanceof Error ? error.message : 'Erro ao salvar')
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [settings])

  // Resetar configurações para padrão
  const resetSettings = useCallback(async () => {
    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch('/api/user/notification-settings', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao resetar configurações')
      }

      const resetSettings = await response.json()
      setSettings(resetSettings)
      setLastSaved(new Date())

      // Limpar localStorage
      try {
        localStorage.removeItem('notification-settings')
      } catch (localError) {
        console.error('Error clearing localStorage:', localError)
      }

      return resetSettings
    } catch (error) {
      console.error('Error resetting notification settings:', error)
      setError(error instanceof Error ? error.message : 'Erro ao resetar')
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Atualizar configuração específica
  const updateSetting = useCallback(async <K extends keyof UserNotificationSettings>(
    key: K,
    value: UserNotificationSettings[K]
  ) => {
    const newSettings = { [key]: value }
    return await saveSettings(newSettings)
  }, [saveSettings])

  // Atualizar múltiplas configurações
  const updateSettings = useCallback(async (newSettings: Partial<UserNotificationSettings>) => {
    return await saveSettings(newSettings)
  }, [saveSettings])

  // Carregar configurações na inicialização
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Auto-save quando configurações mudam (debounced)
  useEffect(() => {
    if (isLoading || isSaving) return

    const timeoutId = setTimeout(() => {
      // Salvar no localStorage imediatamente
      try {
        localStorage.setItem('notification-settings', JSON.stringify(settings))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [settings, isLoading, isSaving])

  return {
    settings,
    isLoading,
    isSaving,
    error,
    lastSaved,
    loadSettings,
    saveSettings,
    resetSettings,
    updateSetting,
    updateSettings
  }
}