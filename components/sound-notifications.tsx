'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

// Tipos de sons disponíveis
export type SoundType = 'new-order' | 'ready' | 'urgent' | 'cancel'

// Configurações de som
export interface SoundSettings {
  enabled: boolean
  volume: number
  sounds: {
    'new-order': boolean
    'ready': boolean
    'urgent': boolean
    'cancel': boolean
  }
}

// Props do componente
interface SoundNotificationsProps {
  enabled: boolean
  onToggle: () => void
  settings?: SoundSettings
  onSettingsChange?: (settings: SoundSettings) => void
}

// Componente principal
export function SoundNotifications({
  enabled,
  onToggle,
  settings = {
    enabled: true,
    volume: 0.7,
    sounds: {
      'new-order': true,
      'ready': true,
      'urgent': true,
      'cancel': true
    }
  },
  onSettingsChange
}: SoundNotificationsProps) {
  const [localSettings, setLocalSettings] = useState<SoundSettings>(settings)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Atualizar configurações locais quando as props mudarem
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  // Salvar configurações quando o diálogo for fechado
  const handleDialogClose = () => {
    if (onSettingsChange) {
      onSettingsChange(localSettings)
    }
    setIsDialogOpen(false)
  }

  // Atualizar uma configuração específica
  const updateSetting = (key: keyof SoundSettings['sounds'], value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        [key]: value
      }
    }))
  }

  // Atualizar volume
  const updateVolume = (value: number[]) => {
    setLocalSettings(prev => ({
      ...prev,
      volume: value[0]
    }))
  }

  // Testar um som
  const playTestSound = (type: SoundType) => {
    if (!enabled || !localSettings.sounds[type]) return
    
    const audio = new Audio(`/sounds/${type}.mp3`)
    audio.volume = localSettings.volume
    audio.play().catch(error => console.error('Error playing sound:', error))
  }

  return (
    <div className="flex items-center">
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggle}
        className={!enabled ? 'text-gray-400' : 'text-green-600'}
        aria-label={enabled ? 'Desativar sons' : 'Ativar sons'}
      >
        {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-500"
            aria-label="Configurações de som"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configurações de Som</DialogTitle>
            <DialogDescription>
              Personalize as notificações sonoras
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="master-volume" className="text-right">
                Volume
              </Label>
              <div className="w-[200px]">
                <Slider
                  id="master-volume"
                  value={[localSettings.volume]}
                  max={1}
                  step={0.1}
                  onValueChange={updateVolume}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tipos de Notificação</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-order-sound"
                    checked={localSettings.sounds['new-order']}
                    onCheckedChange={(checked) => updateSetting('new-order', checked)}
                  />
                  <Label htmlFor="new-order-sound">Novos Pedidos</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playTestSound('new-order')}
                  disabled={!enabled || !localSettings.sounds['new-order']}
                >
                  Testar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ready-sound"
                    checked={localSettings.sounds['ready']}
                    onCheckedChange={(checked) => updateSetting('ready', checked)}
                  />
                  <Label htmlFor="ready-sound">Itens Prontos</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playTestSound('ready')}
                  disabled={!enabled || !localSettings.sounds['ready']}
                >
                  Testar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent-sound"
                    checked={localSettings.sounds['urgent']}
                    onCheckedChange={(checked) => updateSetting('urgent', checked)}
                  />
                  <Label htmlFor="urgent-sound">Alertas Urgentes</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playTestSound('urgent')}
                  disabled={!enabled || !localSettings.sounds['urgent']}
                >
                  Testar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cancel-sound"
                    checked={localSettings.sounds['cancel']}
                    onCheckedChange={(checked) => updateSetting('cancel', checked)}
                  />
                  <Label htmlFor="cancel-sound">Cancelamentos</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playTestSound('cancel')}
                  disabled={!enabled || !localSettings.sounds['cancel']}
                >
                  Testar
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleDialogClose}>
              Salvar Preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Hook para gerenciar notificações sonoras
export function useSoundNotifications() {
  // Carregar configurações do localStorage
  const loadSettings = (): SoundSettings => {
    if (typeof window === 'undefined') {
      return {
        enabled: true,
        volume: 0.7,
        sounds: {
          'new-order': true,
          'ready': true,
          'urgent': true,
          'cancel': true
        }
      }
    }
    
    try {
      const saved = localStorage.getItem('sound-settings')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading sound settings:', error)
    }
    
    return {
      enabled: true,
      volume: 0.7,
      sounds: {
        'new-order': true,
        'ready': true,
        'urgent': true,
        'cancel': true
      }
    }
  }
  
  const [enabled, setEnabled] = useState(true)
  const [settings, setSettings] = useState<SoundSettings>(loadSettings)
  
  // Salvar configurações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sound-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving sound settings:', error)
    }
  }, [settings])
  
  // Função para alternar som
  const toggleSound = () => {
    setEnabled(prev => !prev)
  }
  
  // Função para atualizar configurações
  const updateSettings = (newSettings: SoundSettings) => {
    setSettings(newSettings)
  }
  
  // Função para tocar som baseado no tipo de notificação
  const playNotificationSound = (notification: any) => {
    if (!enabled) return
    
    let soundType: SoundType
    
    switch (notification.type) {
      case 'new_order':
        soundType = 'new-order'
        break
      case 'order_status_changed':
        if (notification.data.newStatus === 'ready') {
          soundType = 'ready'
        } else {
          return // Não tocar som para outras mudanças de status
        }
        break
      case 'order_cancelled':
        soundType = 'cancel'
        break
      case 'urgent_item':
        soundType = 'urgent'
        break
      default:
        return // Tipo desconhecido, não tocar som
    }
    
    // Verificar se este tipo de som está habilitado
    if (!settings.sounds[soundType]) return
    
    try {
      const audio = new Audio(`/sounds/${soundType}.mp3`)
      audio.volume = settings.volume
      audio.play()
    } catch (error) {
      console.error(`Error playing ${soundType} sound:`, error)
    }
  }
  
  return {
    enabled,
    settings,
    toggleSound,
    updateSettings,
    playNotificationSound
  }
}