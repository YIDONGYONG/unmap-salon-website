'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {t.salonName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors">
              {t.header.home}
            </a>
            <a href="#services" className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors">
              {t.header.services}
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors">
              {t.header.pricing}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors">
              {t.header.contact}
            </a>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
              {t.header.bookNow}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-pink-600 focus:outline-none focus:text-pink-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a href="#home" className="text-gray-700 hover:text-pink-600 block px-3 py-2 text-base font-medium">
                {t.header.home}
              </a>
              <a href="#services" className="text-gray-700 hover:text-pink-600 block px-3 py-2 text-base font-medium">
                {t.header.services}
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-pink-600 block px-3 py-2 text-base font-medium">
                {t.header.pricing}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 block px-3 py-2 text-base font-medium">
                {t.header.contact}
              </a>
              <div className="pt-4">
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                  {t.header.bookNow}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
