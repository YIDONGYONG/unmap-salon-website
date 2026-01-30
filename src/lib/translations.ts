export type Language = 'ko' | 'en' | 'ja'

export interface Translations {
  salonName: string
  header: {
    home: string
    services: string
    pricing: string
    contact: string
    bookNow: string
  }
  hero: {
    title: string
    subtitle: string
    description: string
    bookNow: string
    viewServices: string
    experience: string
    satisfied: string
    hygiene: string
  }
  services: {
    title: string
    subtitle: string
    specialTitle: string
    specialDescription: string
    bookConsultation: string
  }
  pricing: {
    title: string
    subtitle: string
    individualTitle: string
    discountTitle: string
    discountDescription: string
    getCoupon: string
    popular: string
    basicPackage: string
    premiumPackage: string
    allInOnePackage: string
    basicFeatures: string[]
    premiumFeatures: string[]
    allInOneFeatures: string[]
  }
  contact: {
    title: string
    subtitle: string
    contactInfo: string
    address: string
    phone: string
    email: string
    hours: string
    hoursDetail: string
    reservationForm: string
    name: string
    phoneNumber: string
    emailAddress: string
    preferredDate: string
    preferredTime: string
    selectTime: string
    desiredService: string
    selectService: string
    additionalRequests: string
    additionalRequestsPlaceholder: string
    submit: string
    submitting: string
    successMessage: string
    errorMessage: string
  }
  footer: {
    description: string
    quickLinks: string
    contact: string
    rights: string
    privacy: string
    terms: string
    sitemap: string
  }
  servicesList: {
    cut: string
    perm: string
    color: string
    upstyle: string
    care: string
    makeup: string
    scalp: string
  }
  serviceDescriptions: {
    cut: string
    perm: string
    care: string
    upstyle: string
    makeup: string
    scalp: string
  }
}

export const translations: Record<Language, Translations> = {
  ko: {
    salonName: '은파미용실',
    header: {
      home: '홈',
      services: '서비스',
      pricing: '가격',
      contact: '문의',
      bookNow: '예약하기'
    },
    hero: {
      title: '당신의 아름다움을',
      subtitle: '완성하는 곳',
      description: '전문적인 기술과 따뜻한 마음으로 당신만의 특별한 스타일을 만들어드립니다',
      bookNow: '지금 예약하기',
      viewServices: '서비스 보기',
      experience: '10년+ 경력',
      satisfied: '1000+ 고객 만족',
      hygiene: '위생 관리 철저'
    },
    services: {
      title: '우리의 서비스',
      subtitle: '전문적인 기술과 최신 트렌드를 반영한 다양한 헤어 서비스를 제공합니다',
      specialTitle: '특별한 날을 위한 완벽한 스타일링',
      specialDescription: '결혼식, 졸업식, 면접 등 중요한 날을 위한 전문적인 헤어 서비스',
      bookConsultation: '상담 예약하기'
    },
    pricing: {
      title: '합리적인 가격',
      subtitle: '고품질 서비스를 합리적인 가격으로 제공합니다',
      individualTitle: '개별 서비스 가격',
      discountTitle: '첫 방문 고객 특별 할인',
      discountDescription: '20% 할인된 가격으로 서비스를 경험해보세요',
      getCoupon: '할인 쿠폰 받기',
      popular: '인기',
      basicPackage: '기본 패키지',
      premiumPackage: '프리미엄 패키지',
      allInOnePackage: '올인원 패키지',
      basicFeatures: [
        '커트 & 스타일링',
        '두피 케어',
        '스타일링 제품 사용',
        '무료 상담'
      ],
      premiumFeatures: [
        '펌 또는 염색',
        '커트 & 스타일링',
        '두피 케어',
        '프리미엄 제품 사용',
        '무료 상담',
        '스타일링 가이드'
      ],
      allInOneFeatures: [
        '펌 + 염색',
        '커트 & 스타일링',
        '두피 케어',
        '업스타일링',
        '프리미엄 제품 사용',
        '무료 상담',
        '스타일링 가이드',
        '후속 관리 상담'
      ]
    },
    contact: {
      title: '예약 및 문의',
      subtitle: '언제든지 편하게 연락주세요. 빠른 시일 내에 답변드리겠습니다',
      contactInfo: '연락처 정보',
      address: '주소',
      phone: '전화번호',
      email: '이메일',
      hours: '영업시간',
      hoursDetail: '월-금: 10:00 - 20:00\n토-일: 10:00 - 19:00\n공휴일: 10:00 - 18:00',
      reservationForm: '예약 문의하기',
      name: '이름',
      phoneNumber: '연락처',
      emailAddress: '이메일',
      preferredDate: '희망 날짜',
      preferredTime: '희망 시간',
      selectTime: '시간 선택',
      desiredService: '원하는 서비스',
      selectService: '서비스 선택',
      additionalRequests: '추가 요청사항',
      additionalRequestsPlaceholder: '원하는 스타일이나 특별한 요청사항이 있으시면 적어주세요',
      submit: '예약 문의하기',
      submitting: '전송 중...',
      successMessage: '예약 문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.',
      errorMessage: '전송 중 오류가 발생했습니다. 다시 시도해주세요.'
    },
    footer: {
      description: '전문적인 기술과 따뜻한 마음으로 당신의 아름다움을 완성하는 프리미엄 헤어 살롱입니다.',
      quickLinks: '빠른 링크',
      contact: '연락처',
      rights: '© 2024 Beauty Salon. All rights reserved.',
      privacy: '개인정보처리방침',
      terms: '이용약관',
      sitemap: '사이트맵'
    },
    servicesList: {
      cut: '커트',
      perm: '펌',
      color: '염색',
      upstyle: '업스타일',
      care: '헤어 케어',
      makeup: '헤어 메이크업',
      scalp: '두피 관리'
    },
    serviceDescriptions: {
      cut: '개성에 맞는 헤어 스타일링과 전문적인 커트 서비스',
      perm: '트렌디한 펌과 개성 있는 염색으로 새로운 스타일 연출',
      care: '두피와 모발 건강을 위한 전문적인 케어 서비스',
      upstyle: '특별한 날을 위한 아름다운 업스타일링',
      makeup: '헤어와 메이크업을 함께하는 완벽한 뷰티 서비스',
      scalp: '전문적인 두피 진단과 맞춤형 관리 프로그램'
    }
  },
  en: {
    salonName: 'Eunpa Beauty Salon',
    header: {
      home: 'Home',
      services: 'Services',
      pricing: 'Pricing',
      contact: 'Contact',
      bookNow: 'Book Now'
    },
    hero: {
      title: 'Where Your Beauty',
      subtitle: 'Comes to Life',
      description: 'We create your unique style with professional skills and warm hearts',
      bookNow: 'Book Now',
      viewServices: 'View Services',
      experience: '10+ Years Experience',
      satisfied: '1000+ Happy Clients',
      hygiene: 'Strict Hygiene Management'
    },
    services: {
      title: 'Our Services',
      subtitle: 'We provide various hair services with professional skills and latest trends',
      specialTitle: 'Perfect Styling for Special Days',
      specialDescription: 'Professional hair services for weddings, graduations, interviews and other important days',
      bookConsultation: 'Book Consultation'
    },
    pricing: {
      title: 'Reasonable Prices',
      subtitle: 'We provide high-quality services at reasonable prices',
      individualTitle: 'Individual Service Prices',
      discountTitle: 'Special Discount for First-Time Visitors',
      discountDescription: 'Experience our services at 20% off',
      getCoupon: 'Get Discount Coupon',
      popular: 'Popular',
      basicPackage: 'Basic Package',
      premiumPackage: 'Premium Package',
      allInOnePackage: 'All-in-One Package',
      basicFeatures: [
        'Cut & Styling',
        'Scalp Care',
        'Styling Products',
        'Free Consultation'
      ],
      premiumFeatures: [
        'Perm or Color',
        'Cut & Styling',
        'Scalp Care',
        'Premium Products',
        'Free Consultation',
        'Styling Guide'
      ],
      allInOneFeatures: [
        'Perm + Color',
        'Cut & Styling',
        'Scalp Care',
        'Upstyling',
        'Premium Products',
        'Free Consultation',
        'Styling Guide',
        'Follow-up Care Consultation'
      ]
    },
    contact: {
      title: 'Reservation & Contact',
      subtitle: 'Feel free to contact us anytime. We will respond as soon as possible',
      contactInfo: 'Contact Information',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      hours: 'Business Hours',
      hoursDetail: 'Mon-Fri: 10:00 - 20:00\nSat-Sun: 10:00 - 19:00\nHolidays: 10:00 - 18:00',
      reservationForm: 'Make Reservation',
      name: 'Name',
      phoneNumber: 'Phone Number',
      emailAddress: 'Email Address',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time',
      selectTime: 'Select Time',
      desiredService: 'Desired Service',
      selectService: 'Select Service',
      additionalRequests: 'Additional Requests',
      additionalRequestsPlaceholder: 'Please write down your desired style or special requests',
      submit: 'Submit Reservation',
      submitting: 'Submitting...',
      successMessage: 'Your reservation request has been sent successfully. We will contact you soon.',
      errorMessage: 'An error occurred during submission. Please try again.'
    },
    footer: {
      description: 'A premium hair salon that completes your beauty with professional skills and warm hearts.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      rights: '© 2024 Beauty Salon. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      sitemap: 'Sitemap'
    },
    servicesList: {
      cut: 'Cut',
      perm: 'Perm',
      color: 'Color',
      upstyle: 'Upstyle',
      care: 'Hair Care',
      makeup: 'Hair & Makeup',
      scalp: 'Scalp Care'
    },
    serviceDescriptions: {
      cut: 'Professional hair styling and cutting service tailored to your personality',
      perm: 'Trendy perms and unique coloring for a new style transformation',
      care: 'Professional care service for scalp and hair health',
      upstyle: 'Beautiful upstyling for special occasions',
      makeup: 'Perfect beauty service combining hair and makeup',
      scalp: 'Professional scalp diagnosis and customized care program'
    }
  },
  ja: {
    salonName: '銀波美容室',
    header: {
      home: 'ホーム',
      services: 'サービス',
      pricing: '料金',
      contact: 'お問い合わせ',
      bookNow: '予約する'
    },
    hero: {
      title: 'あなたの美しさを',
      subtitle: '完成させる場所',
      description: '専門的な技術と温かい心で、あなただけの特別なスタイルを作ります',
      bookNow: '今すぐ予約',
      viewServices: 'サービスを見る',
      experience: '10年以上の経験',
      satisfied: '1000人以上の満足したお客様',
      hygiene: '厳格な衛生管理'
    },
    services: {
      title: '私たちのサービス',
      subtitle: '専門的な技術と最新トレンドを反映した様々なヘアサービスを提供します',
      specialTitle: '特別な日のための完璧なスタイリング',
      specialDescription: '結婚式、卒業式、面接など重要な日のための専門的なヘアサービス',
      bookConsultation: '相談予約'
    },
    pricing: {
      title: 'リーズナブルな料金',
      subtitle: '高品質なサービスをリーズナブルな料金で提供します',
      individualTitle: '個別サービス料金',
      discountTitle: '初回限定特別割引',
      discountDescription: '20%割引でサービスを体験してください',
      getCoupon: '割引クーポンを取得',
      popular: '人気',
      basicPackage: 'ベーシックパッケージ',
      premiumPackage: 'プレミアムパッケージ',
      allInOnePackage: 'オールインワンパッケージ',
      basicFeatures: [
        'カット & スタイリング',
        'スカルプケア',
        'スタイリング製品使用',
        '無料相談'
      ],
      premiumFeatures: [
        'パーマまたはカラー',
        'カット & スタイリング',
        'スカルプケア',
        'プレミアム製品使用',
        '無料相談',
        'スタイリングガイド'
      ],
      allInOneFeatures: [
        'パーマ + カラー',
        'カット & スタイリング',
        'スカルプケア',
        'アップスタイリング',
        'プレミアム製品使用',
        '無料相談',
        'スタイリングガイド',
        'フォローアップケア相談'
      ]
    },
    contact: {
      title: '予約・お問い合わせ',
      subtitle: 'いつでもお気軽にお問い合わせください。できるだけ早くご返信いたします',
      contactInfo: '連絡先情報',
      address: '住所',
      phone: '電話番号',
      email: 'メールアドレス',
      hours: '営業時間',
      hoursDetail: '月-金: 10:00 - 20:00\n土-日: 10:00 - 19:00\n祝日: 10:00 - 18:00',
      reservationForm: '予約お問い合わせ',
      name: 'お名前',
      phoneNumber: '電話番号',
      emailAddress: 'メールアドレス',
      preferredDate: '希望日',
      preferredTime: '希望時間',
      selectTime: '時間選択',
      desiredService: '希望サービス',
      selectService: 'サービス選択',
      additionalRequests: '追加リクエスト',
      additionalRequestsPlaceholder: '希望するスタイルや特別なリクエストがございましたらお書きください',
      submit: '予約お問い合わせ',
      submitting: '送信中...',
      successMessage: '予約お問い合わせが正常に送信されました。できるだけ早くご連絡いたします。',
      errorMessage: '送信中にエラーが発生しました。もう一度お試しください。'
    },
    footer: {
      description: '専門的な技術と温かい心で、あなたの美しさを完成させるプレミアムヘアサロンです。',
      quickLinks: 'クイックリンク',
      contact: '連絡先',
      rights: '© 2024 Beauty Salon. All rights reserved.',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      sitemap: 'サイトマップ'
    },
    servicesList: {
      cut: 'カット',
      perm: 'パーマ',
      color: 'カラー',
      upstyle: 'アップスタイル',
      care: 'ヘアケア',
      makeup: 'ヘアメイク',
      scalp: 'スカルプケア'
    },
    serviceDescriptions: {
      cut: '個性に合わせたヘアスタイリングと専門的なカットサービス',
      perm: 'トレンディなパーマと個性的なカラーリングで新しいスタイル演出',
      care: '頭皮と髪の健康のための専門的なケアサービス',
      upstyle: '特別な日のための美しいアップスタイリング',
      makeup: 'ヘアとメイクを組み合わせた完璧なビューティサービス',
      scalp: '専門的な頭皮診断とカスタマイズされたケアプログラム'
    }
  }
}
