import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApexLogo } from '@/components/apex-logo'
import {
    Zap,
    Shield,
    Smartphone,
    Users,
    BarChart3,
    Settings,
    CreditCard,
    Bell,
    Database,
    Cloud,
    Lock,
    Headphones,
    Globe,
    Palette,
    Code,
    Workflow
} from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
    const features = [
        {
            category: "Gestão de Restaurante",
            icon: BarChart3,
            color: "bg-blue-500",
            items: [
                {
                    title: "Controle de Mesas",
                    description: "Visualize status das mesas em tempo real e otimize o atendimento",
                    icon: BarChart3
                },
                {
                    title: "Gestão de Pedidos",
                    description: "Sistema completo da mesa à cozinha com notificações automáticas",
                    icon: Database
                },
                {
                    title: "Cardápio Digital",
                    description: "Gerencie produtos, preços e categorias de forma simples",
                    icon: Zap
                }
            ]
        },
        {
            category: "Gestão de Clube",
            icon: Users,
            color: "bg-green-500",
            items: [
                {
                    title: "Controle de Entrada",
                    description: "Registre visitantes, associados e funcionários com facilidade",
                    icon: Lock
                },
                {
                    title: "Cadastro de Visitantes",
                    description: "Sistema completo com CPF, telefone e categoria de entrada",
                    icon: Shield
                },
                {
                    title: "Relatórios de Movimento",
                    description: "Acompanhe fluxo de pessoas e horários de pico",
                    icon: Settings
                }
            ]
        },
        {
            category: "Interface & Usabilidade",
            icon: Smartphone,
            color: "bg-purple-500",
            items: [
                {
                    title: "Design Intuitivo",
                    description: "Interface simples que qualquer funcionário aprende rapidamente",
                    icon: Smartphone
                },
                {
                    title: "Acesso Mobile",
                    description: "Funciona perfeitamente em tablets e smartphones",
                    icon: Globe
                },
                {
                    title: "Modo Offline",
                    description: "Continue trabalhando mesmo sem internet estável",
                    icon: Zap
                }
            ]
        },
        {
            category: "Relatórios & Analytics",
            icon: Code,
            color: "bg-orange-500",
            items: [
                {
                    title: "Dashboard Executivo",
                    description: "Visão geral do negócio com métricas importantes",
                    icon: Code
                },
                {
                    title: "Relatórios de Vendas",
                    description: "Análise detalhada de faturamento e produtos mais vendidos",
                    icon: Bell
                },
                {
                    title: "Controle de Estoque",
                    description: "Monitore produtos em falta e gere alertas automáticos",
                    icon: Workflow
                }
            ]
        },
        {
            category: "Gestão Financeira",
            icon: CreditCard,
            color: "bg-red-500",
            items: [
                {
                    title: "Controle de Caixa",
                    description: "Acompanhe entradas e saídas em tempo real",
                    icon: CreditCard
                },
                {
                    title: "Múltiplas Formas de Pagamento",
                    description: "Dinheiro, cartão, PIX e outros métodos de pagamento",
                    icon: Settings
                },
                {
                    title: "Fechamento Diário",
                    description: "Relatórios automáticos de vendas e movimento do dia",
                    icon: Database
                }
            ]
        },
        {
            category: "Suporte & Segurança",
            icon: Headphones,
            color: "bg-indigo-500",
            items: [
                {
                    title: "Suporte Especializado",
                    description: "Equipe técnica para restaurantes e clubes",
                    icon: Headphones
                },
                {
                    title: "Backup Automático",
                    description: "Seus dados sempre seguros e protegidos",
                    icon: Palette
                },
                {
                    title: "Atualizações Gratuitas",
                    description: "Novos recursos sem custo adicional",
                    icon: Cloud
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Recursos Completos
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Descubra todas as funcionalidades que tornam nosso sistema a escolha ideal
                        para restaurantes e clubes modernos e eficientes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                Começar Agora
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                                Ver Preços
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid gap-12">
                        {features.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="space-y-8">
                                {/* Category Header */}
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                                        <category.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                                    </div>
                                </div>

                                {/* Features Cards */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    {category.items.map((feature, featureIndex) => (
                                        <Card key={featureIndex} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <feature.icon className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Números que Impressionam
                        </h2>
                        <p className="text-xl text-gray-600">
                            Resultados comprovados de quem já usa nossa plataforma
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                            <div className="text-gray-600">Uptime Garantido</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">10k+</div>
                            <div className="text-gray-600">Usuários Ativos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600 mb-2">50ms</div>
                            <div className="text-gray-600">Tempo de Resposta</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                            <div className="text-gray-600">Suporte Disponível</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Pronto para Experimentar?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Comece gratuitamente e descubra como nossa plataforma pode transformar seu negócio
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                                Teste Grátis por 14 Dias
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                                Ver Todos os Planos
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="mb-4">
                                <ApexLogo size="md" />
                            </div>
                            <p className="text-gray-400">
                                Sistema completo de gestão para restaurantes e clubes com tecnologia APEX.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Produto</h3>
                            <div className="space-y-2 text-gray-400">
                                <Link href="/features" className="block hover:text-white">Recursos</Link>
                                <Link href="/pricing" className="block hover:text-white">Preços</Link>
                                <Link href="/dashboard" className="block hover:text-white">Dashboard</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Empresa</h3>
                            <div className="space-y-2 text-gray-400">
                                <Link href="/about" className="block hover:text-white">Sobre</Link>
                                <Link href="/contact" className="block hover:text-white">Contato</Link>
                                <Link href="/careers" className="block hover:text-white">Carreiras</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Suporte</h3>
                            <div className="space-y-2 text-gray-400">
                                <Link href="/help" className="block hover:text-white">Central de Ajuda</Link>
                                <Link href="/docs" className="block hover:text-white">Documentação</Link>
                                <Link href="/status" className="block hover:text-white">Status</Link>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 APEX. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}