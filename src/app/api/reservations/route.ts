// GitHub Pages는 정적 사이트이므로 API 라우트가 작동하지 않습니다.
// 이 파일은 주석처리되었으며, 예약 기능은 mailto/Formspree를 통해 작동합니다.

/*
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { reservationSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting 체크
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const isAllowed = await checkRateLimit(ip, 10, 60) // 60초에 10회 제한
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // 입력 검증 (Zod 스키마 사용)
    const validationResult = reservationSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ')
      return NextResponse.json(
        { error: `입력 형식 오류: ${errors}` },
        { status: 400 }
      )
    }

    const { name, email, phone, date, time, service, message } = validationResult.data

    // 예약 데이터 저장
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        date,
        time,
        service,
        message,
      },
    })

    // 이메일 알림 전송 (비동기로 처리)
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          service,
          message,
        }),
      })

      if (!emailResponse.ok) {
        console.error('이메일 전송 실패:', await emailResponse.text())
      }
    } catch (emailError) {
      console.error('이메일 전송 중 오류:', emailError)
      // 이메일 전송 실패해도 예약은 성공으로 처리
    }

    return NextResponse.json(
      { 
        message: '예약이 성공적으로 저장되었습니다.',
        reservation 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('예약 저장 중 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 인증 체크: Admin API Token 검증
    const token = request.headers.get('x-admin-token')
    const expectedToken = process.env.ADMIN_API_TOKEN

    if (!expectedToken) {
      console.error('ADMIN_API_TOKEN 환경 변수가 설정되지 않았습니다.')
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (token !== expectedToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('예약 조회 중 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
*/

// GitHub Pages용 빈 export (빌드 에러 방지)
export const dynamic = 'force-static'
