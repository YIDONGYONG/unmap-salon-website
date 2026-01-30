/**
 * 간단한 Rate Limiting 구현
 * 프로덕션 환경에서는 Redis 기반 솔루션(Upstash 등) 사용 권장
 */

interface RateLimitRecord {
  count: number
  resetAt: number
}

// 메모리 기반 저장소 (서버리스 환경에서는 제한적)
// 프로덕션에서는 Redis 사용 권장
const requestCounts = new Map<string, RateLimitRecord>()

// 정리 작업: 오래된 레코드 삭제
const cleanup = () => {
  const now = Date.now()
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetAt) {
      requestCounts.delete(ip)
    }
  }
}

/**
 * Rate Limit 체크
 * @param identifier - IP 주소 또는 사용자 식별자
 * @param limit - 시간당 허용 횟수
 * @param windowSeconds - 시간 윈도우 (초)
 * @returns true: 허용, false: 제한 초과
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<boolean> {
  const now = Date.now()
  const window = windowSeconds * 1000

  // 주기적으로 정리 작업 수행
  if (Math.random() < 0.1) {
    cleanup()
  }

  const record = requestCounts.get(identifier)

  // 레코드가 없거나 시간 윈도우가 지났으면 초기화
  if (!record || now > record.resetAt) {
    requestCounts.set(identifier, {
      count: 1,
      resetAt: now + window,
    })
    return true
  }

  // 제한 초과
  if (record.count >= limit) {
    return false
  }

  // 카운트 증가
  record.count++
  return true
}

/**
 * Rate Limit 정보 가져오기
 */
export function getRateLimitInfo(identifier: string): {
  remaining: number
  resetAt: number
} | null {
  const record = requestCounts.get(identifier)
  if (!record) {
    return null
  }

  return {
    remaining: Math.max(0, 10 - record.count), // 기본 limit 10 기준
    resetAt: record.resetAt,
  }
}

