// GitHub Pages는 정적 사이트이므로 데이터베이스 연결이 불가능합니다.
// Prisma 관련 코드는 주석처리되었습니다.

/*
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
*/

// GitHub Pages용 빈 export (빌드 에러 방지)
export const prisma = null as any
