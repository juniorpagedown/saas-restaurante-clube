'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
    Plus,
    Minus,
    ShoppingCart,
    Search,
    X,
    Check
} from 'lucide-react'

interface Product {
    id: string
    name: string
    price: number
    category: string
    description?: string | null
    isActive: boolean
}

interface OrderItem {
    productId: string
    product: Product
    quantity: number
    notes?: string
}

interface OrderFormProps {
    tableId?: string
    tableNumber?: number
    onOrderCreated?: () => void
    onClose?: () => void
}

export function OrderForm({ tableId, tableNumber, onOrderCreated, onClose }: OrderFormProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [companyId, setCompanyId] = useState<string | null>(null)
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        fetchProducts()
        fetchCompanyId()
    }, [])

    const fetchCompanyId = async () => {
        try {
            const res = await fetch('/api/user-context')
            if (!res.ok) return
            const data = await res.json()
            setCompanyId(data?.company?.id || null)
        } catch (err) {
            setCompanyId(null)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos')
            }
            const data = await response.json()
            setProducts(data.filter((p: Product) => p.isActive))
        } catch (error) {
            console.error('Erro ao carregar produtos:', error)
            setProducts([])
        }
    }

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const addToOrder = (product: Product) => {
        const existingItem = orderItems.find(item => item.productId === product.id)

        if (existingItem) {
            setOrderItems(orderItems.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ))
        } else {
            setOrderItems([...orderItems, {
                productId: product.id,
                product,
                quantity: 1
            }])
        }
    }

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setOrderItems(orderItems.filter(item => item.productId !== productId))
        } else {
            setOrderItems(orderItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ))
        }
    }

    const updateNotes = (productId: string, notes: string) => {
        setOrderItems(orderItems.map(item =>
            item.productId === productId
                ? { ...item, notes }
                : item
        ))
    }

    const getTotalAmount = () => {
        return orderItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    }

    const handleSubmitOrder = async () => {
        // Prevenção rigorosa contra duplo clique
        if (orderItems.length === 0 || loading || submitted) {
            console.log('Pedido bloqueado:', { orderItems: orderItems.length, loading, submitted })
            return
        }
        
        // Validações
        if (!companyId) {
            alert('Erro: Empresa não identificada')
            return
        }

        // Definir estados imediatamente para prevenir duplo clique
        setLoading(true)
        setSubmitted(true)
        
        // Debug log
        console.log('Iniciando criação de pedido...', { loading: true, submitted: true })
        
        try {
            const orderData = {
                tableId,
                companyId,
                customerName: customerName || null,
                items: orderItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                    notes: item.notes || null
                })),
                total: getTotalAmount()
            }

            console.log('Enviando pedido:', orderData)

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })

            if (response.ok) {
                const result = await response.json()
                console.log('Pedido criado com sucesso:', result)
                
                // Mostrar mensagem de sucesso ANTES de limpar
                const total = getTotalAmount()
                alert(`Pedido criado com sucesso! ${tableNumber ? `Mesa ${tableNumber}` : 'Balcão'} - Total: R$ ${total.toFixed(2)}`)
                
                // Limpar formulário
                setOrderItems([])
                setCustomerName('')
                setLoading(false)
                setSubmitted(false)
                
                // Callbacks
                onOrderCreated?.()
                onClose?.()
            } else {
                const error = await response.text()
                console.error('Erro na resposta da API:', response.status, error)
                alert('Erro ao criar pedido. Tente novamente.')
                setSubmitted(false)
                setLoading(false)
            }
        } catch (error) {
            console.error('Erro ao criar pedido:', error)
            alert('Erro de conexão. Verifique sua internet e tente novamente.')
            setSubmitted(false)
            setLoading(false)
        }
    }

    const clearOrder = () => {
        if (orderItems.length > 0) {
            const confirm = window.confirm('Tem certeza que deseja limpar todos os itens do pedido?')
            if (confirm) {
                setOrderItems([])
                setCustomerName('')
            }
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Lista de Produtos */}
            <div className="lg:col-span-2 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Produtos Disponíveis</span>
                            {onClose && (
                                <Button variant="ghost" size="sm" onClick={onClose}>
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Busca e Filtros */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">Todas Categorias</option>
                                {categories.filter(cat => cat !== 'all').map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Grid de Produtos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                            {filteredProducts.map(product => (
                                <Card 
                                    key={product.id} 
                                    className="hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50 border-2 hover:border-blue-300"
                                    onClick={() => addToOrder(product)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-sm">{product.name}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {product.category}
                                            </Badge>
                                        </div>
                                        {product.description && (
                                            <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-green-600">
                                                R$ {product.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Comanda/Pedido */}
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {tableNumber ? `Mesa ${tableNumber}` : 'Balcão'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Nome do Cliente */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Cliente (opcional)
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Nome do cliente"
                            />
                        </div>

                        {/* Itens do Pedido */}
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {orderItems.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                    Nenhum item adicionado
                                </p>
                            ) : (
                                orderItems.map(item => (
                                    <div key={item.productId} className="border rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">{item.product.name}</h4>
                                                <p className="text-xs text-gray-600">
                                                    R$ {item.product.price.toFixed(2)} cada
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="text-sm font-medium w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Observações */}
                                        <input
                                            type="text"
                                            placeholder="Observações..."
                                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                                            value={item.notes || ''}
                                            onChange={(e) => updateNotes(item.productId, e.target.value)}
                                        />

                                        <div className="text-right">
                                            <span className="font-semibold text-sm">
                                                R$ {(item.product.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Total e Finalizar */}
                        {orderItems.length > 0 && (
                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total:</span>
                                    <span className="font-bold text-lg text-green-600">
                                        R$ {getTotalAmount().toFixed(2)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSubmitOrder}
                                        disabled={loading || submitted || orderItems.length === 0}
                                        size="lg"
                                        type="button"
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Processando...
                                            </div>
                                        ) : submitted ? (
                                            <div className="flex items-center">
                                                <Check className="w-4 h-4 mr-2" />
                                                Pedido Enviado
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Check className="w-4 h-4 mr-2" />
                                                Finalizar Pedido ({orderItems.length} {orderItems.length === 1 ? 'item' : 'itens'})
                                            </div>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={clearOrder}
                                        disabled={loading || submitted}
                                        size="sm"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Limpar Pedido
                                    </Button>
                                    
                                    <p className="text-xs text-gray-500 text-center">
                                        {tableNumber ? `Mesa ${tableNumber}` : 'Balcão'} • {orderItems.length} {orderItems.length === 1 ? 'produto' : 'produtos'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}