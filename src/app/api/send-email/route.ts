import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import React from 'react'
import EmailTemplate from '@/components/EmailTemplate'
import { checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key')

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting 체크 (이메일 API는 더 엄격하게)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const isAllowed = await checkRateLimit(ip, 5, 60) // 60초에 5회 제한 (이메일은 더 엄격)
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // 입력 검증 (Zod 스키마 사용)
    const { reservationSchema } = await import('@/lib/validation')
    const validationResult = reservationSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ')
      return NextResponse.json(
        { error: `입력 형식 오류: ${errors}` },
        { status: 400 }
      )
    }

    const { name, email, phone, date, time, service, message } = validationResult.data

    // Resend API 키가 없으면 이메일 전송 건너뛰기
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key') {
      console.log('Resend API 키가 설정되지 않아 이메일 전송을 건너뜁니다.')
      return NextResponse.json(
        { 
          message: '이메일 전송이 비활성화되어 있습니다.',
          note: 'Resend API 키를 설정하면 이메일 알림을 받을 수 있습니다.'
        },
        { status: 200 }
      )
    }

    // 관리자 이메일 주소 (환경 변수에서 가져오기)
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error('ADMIN_EMAIL 환경 변수가 설정되지 않았습니다.')
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 이메일 전송
    const { data, error } = await resend.emails.send({
      from: '은파미용실 <noreply@yourdomain.com>',
      to: [adminEmail],
      subject: `💇‍♀️ 새로운 예약 접수 - ${name}님`,
      react: EmailTemplate({
        name,
        email,
        phone,
        date,
        time,
        service,
        message
      }) as React.ReactElement,
    })

    if (error) {
      console.error('이메일 전송 오류:', error)
      return NextResponse.json(
        { error: '이메일 전송에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: '이메일이 성공적으로 전송되었습니다.',
        data 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('이메일 전송 중 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
