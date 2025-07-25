'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Edit,
  Trash2,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  category: string
  image?: string | null
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
  companyId?: string
}

interface ProductsGridProps {
  products: Product[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const [filter, setFilter] = useState('all')

  const categories = Array.from(new Set(products.map(p => p.category)))

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    return product.category === filter
  })

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isActive: !isActive })
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* ✅ Filtros por Categoria com texto preto e contraste visível */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          onClick={() => setFilter('all')}
          className={`
            text-black border text-sm px-4 py-2 rounded-md
            ${filter === 'all'
              ? 'bg-gray-200 border-gray-400'
              : 'bg-white border-gray-300 hover:bg-gray-50'}
          `}
        >
          Todos
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setFilter(category)}
            className={`
              text-black border text-sm px-4 py-2 rounded-md
              ${filter === category
                ? 'bg-gray-200 border-gray-400'
                : 'bg-white border-gray-300 hover:bg-gray-50'}
            `}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={`hover:shadow-lg transition-shadow ${!product.isActive ? 'opacity-60' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                  >
                    {product.isActive ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {product.image && (
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500">Imagem</span>
                </div>
              )}

              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center text-green-600 font-bold text-lg">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {product.price.toFixed(2)}
                </div>

                <div className="flex items-center space-x-2">
                  {!product.isActive && (
                    <Badge variant="destructive" className="text-xs">
                      Inativo
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  )
}
