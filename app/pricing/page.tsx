export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    description: 'Perfeito para começar',
    features: [
      'Até 1.000 usuários',
      'Dashboard básico',
      'Suporte por email',
      'SSL gratuito',
    ],
    cta: 'Começar Grátis',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'R$ 49',
    period: '/mês',
    description: 'Para equipes em crescimento',
    features: [
      'Usuários ilimitados',
      'Dashboard avançado',
      'Suporte prioritário',
      'Analytics detalhado',
      'API completa',
      'Integrações',
    ],
    cta: 'Assinar Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'R$ 199',
    period: '/mês',
    description: 'Para grandes empresas',
    features: [
      'Tudo do Pro',
      'Suporte 24/7',
      'SLA garantido',
      'Customizações',
      'Onboarding dedicado',
      'Relatórios personalizados',
    ],
    cta: 'Falar com Vendas',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Preços Simples e Transparentes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para sua empresa. Sem taxas ocultas, 
              cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary-500 shadow-lg scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/dashboard" className="block">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-primary-600 hover:bg-primary-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Perguntas Frequentes
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-gray-600">
                  Sim, você pode cancelar sua assinatura a qualquer momento 
                  sem taxas de cancelamento.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Há período de teste gratuito?
                </h3>
                <p className="text-gray-600">
                  Sim, todos os planos pagos incluem 14 dias de teste gratuito 
                  sem necessidade de cartão de crédito.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Como funciona o suporte?
                </h3>
                <p className="text-gray-600">
                  Oferecemos suporte por email para todos os planos, 
                  com suporte prioritário para clientes Pro e Enterprise.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso fazer upgrade/downgrade?
                </h3>
                <p className="text-gray-600">
                  Sim, você pode alterar seu plano a qualquer momento. 
                  As mudanças são aplicadas no próximo ciclo de cobrança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}