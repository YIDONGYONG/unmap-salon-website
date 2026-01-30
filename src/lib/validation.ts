import { z } from 'zod'

/**
 * 예약 폼 검증 스키마
 */
export const reservationSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(50, '이름은 50자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글 또는 영문만 입력 가능합니다.'),
  email: z
    .string()
    .email('올바른 이메일 형식이 아닙니다.')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '전화번호는 010-XXXX-XXXX 형식이어야 합니다.')
    .or(z.string().regex(/^01[0-9]-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다.')),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다.')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, '과거 날짜는 선택할 수 없습니다.'),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, '시간 형식이 올바르지 않습니다.')
    .refine((time) => {
      const [hours] = time.split(':').map(Number)
      return hours >= 9 && hours <= 19
    }, '예약 가능 시간은 09:00 ~ 19:00입니다.'),
  service: z
    .string()
    .max(100, '서비스명은 100자 이하여야 합니다.')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(500, '요청사항은 500자 이하여야 합니다.')
    .optional()
    .or(z.literal('')),
})

export type ReservationInput = z.infer<typeof reservationSchema>

