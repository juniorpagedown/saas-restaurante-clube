import React, { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon, HomeIcon, TableCellsIcon, ReceiptPercentIcon, BuildingStorefrontIcon, ChartBarIcon, Cog6ToothIcon, UserCircleIcon, ArrowRightOnRectangleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { ApexLogo } from './apex-logo'

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
  { name: 'Mesas', icon: TableCellsIcon, href: '/dashboard/tables' },
  { name: 'Garçom', icon: UserCircleIcon, href: '/dashboard/garcom' },
  { name: 'Cozinha', icon: Cog6ToothIcon, href: '/dashboard/cozinha' },
  { name: 'Relatórios', icon: ChartBarIcon, href: '/dashboard/reports' },
  { name: 'Administração', icon: Cog6ToothIcon, href: '/dashboard/admin' },
]

export function TopNavigation({ companyName = 'Minha Empresa', user = { name: 'Usuário', avatarUrl: '' }, plan = 'Free', active = '/dashboard' }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo e Empresa */}
        <div className="flex items-center gap-4">
          <ApexLogo className="h-8 w-auto" />
          <span className="font-semibold text-lg text-gray-900">{companyName}</span>
        </div>
        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
        {/* Plano */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <SparklesIcon className="h-5 w-5 text-gray-400" />
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{plan}</span>
        </div>
        {/* Avatar e Dropdown */}
        <Menu as="div" className="relative ml-4">
          <Menu.Button className="flex items-center gap-2 focus:outline-none">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            )}
            <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/profile"
                      className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                    >
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      Perfil
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${active ? 'bg-gray-100' : ''}`}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        {/* Menu Mobile */}
        <button className="md:hidden ml-2 p-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
      {/* Drawer Mobile */}
      <Transition show={mobileOpen} as={React.Fragment}>
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30" onClick={() => setMobileOpen(false)} />
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col">
          <div className="flex items-center gap-4 px-4 py-4 border-b">
            <ApexLogo className="h-8 w-auto" />
            <span className="font-semibold text-lg text-gray-900">{companyName}</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(item => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="px-4 py-4 border-t flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{plan}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left border-t mt-2" onClick={() => {/* logout logic */}}>
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
            Sair
          </button>
        </div>
      </Transition>
    </header>
  )
}
