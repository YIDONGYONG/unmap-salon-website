'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Pricing() {
  const { t } = useLanguage()

  const pricingPlans = [
    {
      id: 1,
      name: t.pricing.basicPackage,
      price: "50,000원",
      duration: "1회",
      features: t.pricing.basicFeatures,
      popular: false
    },
    {
      id: 2,
      name: t.pricing.premiumPackage,
      price: "120,000원",
      duration: "1회",
      features: t.pricing.premiumFeatures,
      popular: true
    },
    {
      id: 3,
      name: t.pricing.allInOnePackage,
      price: "200,000원",
      duration: "1회",
      features: t.pricing.allInOneFeatures,
      popular: false
    }
  ]

  const individualServices = [
    { name: t.servicesList.cut, price: "30,000원" },
    { name: t.servicesList.perm, price: "80,000원" },
    { name: t.servicesList.color, price: "70,000원" },
    { name: t.servicesList.upstyle, price: "60,000원" },
    { name: t.servicesList.care, price: "50,000원" },
    { name: t.servicesList.makeup, price: "100,000원" }
  ]

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Pricing Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-pink-500 bg-gradient-to-b from-pink-50 to-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-pink-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {t.pricing.popular}
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-pink-600">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-pink-600 hover:bg-pink-700 text-white'
                      : 'bg-gray-100 hover:bg-pink-600 hover:text-white text-gray-900'
                  }`}
                >
                  {t.header.bookNow}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Individual Services */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t.pricing.individualTitle}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {individualServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    {service.name}
                  </span>
                  <span className="text-xl font-bold text-pink-600">
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t.pricing.discountTitle}
            </h3>
            <p className="text-pink-100 mb-6">
              {t.pricing.discountDescription}
            </p>
            <button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors">
              {t.pricing.getCoupon}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
