'use client'

import { useState, useEffect } from 'react'
import { Settings, Bell, Save } from 'lucide-react'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { SoundSettings } from './sound-notifications'

// Configurações de notificação
export interface NotificationSettings {
  sounds: SoundSettings
  visual: {
    showToasts: boolean
    urgentHighlight: boolean
    animateNew: boolean
    showTimers: boolean
  }
  autoRefresh: {
    enabled: boolean
    interval: number // segundos
  }
}

// Props do componente
interface NotificationSettingsProps {
  settings: NotificationSettings
  onSettingsChange: (settings: NotificationSettings) => void
}

// Componente principal
export function NotificationSettings({
  settings,
  onSettingsChange
}: NotificationSettingsProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Atualizar configurações locais quando as props mudarem
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  // Salvar configurações quando o diálogo for fechado
  const handleDialogClose = () => {
    onSettingsChange(localSettings)
    setIsDialogOpen(false)
  }

  // Atualizar configurações visuais
  const updateVisualSetting = (key: keyof NotificationSettings['visual'], value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      visual: {
        ...prev.visual,
        [key]: value
      }
    }))
  }

  // Atualizar configurações de atualização automática
  const updateAutoRefreshSetting = (key: keyof NotificationSettings['autoRefresh'], value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      autoRefresh: {
        ...prev.autoRefresh,
        [key]: value
      }
    }))
  }

  // Atualizar configurações de som
  const updateSoundSettings = (newSoundSettings: SoundSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      sounds: newSoundSettings
    }))
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações de Notificação</DialogTitle>
          <DialogDescription>
            Personalize como você recebe notificações
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="sound">Som</TabsTrigger>
            <TabsTrigger value="refresh">Atualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-toasts"
                    checked={localSettings.visual.showToasts}
                    onCheckedChange={(checked) => updateVisualSetting('showToasts', checked)}
                  />
                  <Label htmlFor="show-toasts">Mostrar notificações pop-up</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent-highlight"
                    checked={localSettings.visual.urgentHighlight}
                    onCheckedChange={(checked) => updateVisualSetting('urgentHighlight', checked)}
                  />
                  <Label htmlFor="urgent-highlight">Destacar itens urgentes</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="animate-new"
                    checked={localSettings.visual.animateNew}
                    onCheckedChange={(checked) => updateVisualSetting('animateNew', checked)}
                  />
                  <Label htmlFor="animate-new">Animar novos pedidos</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-timers"
                    checked={localSettings.visual.showTimers}
                    onCheckedChange={(checked) => updateVisualSetting('showTimers', checked)}
                  />
                  <Label htmlFor="show-timers">Mostrar temporizadores</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sound" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="master-volume" className="text-right">
                Volume
              </Label>
              <div className="w-[200px]">
                <Slider
                  id="master-volume"
                  value={[localSettings.sounds.volume]}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => {
                    updateSoundSettings({
                      ...localSettings.sounds,
                      volume: value[0]
                    })
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tipos de Notificação</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-order-sound"
                    checked={localSettings.sounds.sounds['new-order']}
                    onCheckedChange={(checked) => {
                      updateSoundSettings({
                        ...localSettings.sounds,
                        sounds: {
                          ...localSettings.sounds.sounds,
                          'new-order': checked
                        }
                      })
                    }}
                  />
                  <Label htmlFor="new-order-sound">Novos Pedidos</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const audio = new Audio('/sounds/new-order.mp3')
                    audio.volume = localSettings.sounds.volume
                    audio.play()
                  }}
                  disabled={!localSettings.sounds.enabled || !localSettings.sounds.sounds['new-order']}
                >
                  Testar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ready-sound"
                    checked={localSettings.sounds.sounds['ready']}
                    onCheckedChange={(checked) => {
                      updateSoundSettings({
                        ...localSettings.sounds,
                        sounds: {
                          ...localSettings.sounds.sounds,
                          'ready': checked
                        }
                      })
                    }}
                  />
                  <Label htmlFor="ready-sound">Itens Prontos</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const audio = new Audio('/sounds/ready.mp3')
                    audio.volume = localSettings.sounds.volume
                    audio.play()
                  }}
                  disabled={!localSettings.sounds.enabled || !localSettings.sounds.sounds['ready']}
                >
                  Testar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent-sound"
                    checked={localSettings.sounds.sounds['urgent']}
                    onCheckedChange={(checked) => {
                      updateSoundSettings({
                        ...localSettings.sounds,
                        sounds: {
                          ...localSettings.sounds.sounds,
                          'urgent': checked
                        }
                      })
                    }}
                  />
                  <Label htmlFor="urgent-sound">Alertas Urgentes</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const audio = new Audio('/sounds/urgent.mp3')
                    audio.volume = localSettings.sounds.volume
                    audio.play()
                  }}
                  disabled={!localSettings.sounds.enabled || !localSettings.sounds.sounds['urgent']}
                >
                  Testar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cancel-sound"
                    checked={localSettings.sounds.sounds['cancel']}
                    onCheckedChange={(checked) => {
                      updateSoundSettings({
                        ...localSettings.sounds,
                        sounds: {
                          ...localSettings.sounds.sounds,
                          'cancel': checked
                        }
                      })
                    }}
                  />
                  <Label htmlFor="cancel-sound">Cancelamentos</Label>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const audio = new Audio('/sounds/cancel.mp3')
                    audio.volume = localSettings.sounds.volume
                    audio.play()
                  }}
                  disabled={!localSettings.sounds.enabled || !localSettings.sounds.sounds['cancel']}
                >
                  Testar
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="refresh" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-refresh"
                  checked={localSettings.autoRefresh.enabled}
                  onCheckedChange={(checked) => updateAutoRefreshSetting('enabled', checked)}
                />
                <Label htmlFor="auto-refresh">Atualização automática</Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="refresh-interval" className="text-right">
                Intervalo (segundos)
              </Label>
              <div className="w-[200px]">
                <Slider
                  id="refresh-interval"
                  value={[localSettings.autoRefresh.interval]}
                  min={10}
                  max={120}
                  step={5}
                  disabled={!localSettings.autoRefresh.enabled}
                  onValueChange={(value) => updateAutoRefreshSetting('interval', value[0])}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">10s</span>
                  <span className="text-xs text-gray-500">{localSettings.autoRefresh.interval}s</span>
                  <span className="text-xs text-gray-500">120s</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="submit" onClick={handleDialogClose} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook para gerenciar configurações de notificação
export function useNotificationSettings() {
  // Configurações padrão
  const defaultSettings: NotificationSettings = {
    sounds: {
      enabled: true,
      volume: 0.7,
      sounds: {
        'new-order': true,
        'ready': true,
        'urgent': true,
        'cancel': true
      }
    },
    visual: {
      showToasts: true,
      urgentHighlight: true,
      animateNew: true,
      showTimers: true
    },
    autoRefresh: {
      enabled: true,
      interval: 30
    }
  }
  
  // Carregar configurações do localStorage
  const loadSettings = (): NotificationSettings => {
    if (typeof window === 'undefined') {
      return defaultSettings
    }
    
    try {
      const saved = localStorage.getItem('notification-settings')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
    
    return defaultSettings
  }
  
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings)
  
  // Salvar configurações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notification-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving notification settings:', error)
    }
  }, [settings])
  
  // Função para atualizar configurações
  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
  }
  
  return {
    settings,
    updateSettings
  }
}