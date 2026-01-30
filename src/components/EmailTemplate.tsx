interface EmailTemplateProps {
  name: string
  email?: string
  phone: string
  date: string
  time: string
  service?: string
  message?: string
}

export default function EmailTemplate({
  name,
  email,
  phone,
  date,
  time,
  service,
  message
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f3f4f6', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ec4899', margin: 0 }}>💇‍♀️ 은파미용실</h1>
        <p style={{ color: '#6b7280', margin: '10px 0 0 0' }}>새로운 예약이 접수되었습니다</p>
      </div>
      
      <div style={{ padding: '30px', backgroundColor: 'white' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>📅 예약 정보</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#374151', marginBottom: '10px' }}>예약자 정보</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#374151' }}>이름:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{name}</td>
            </tr>
            {email && (
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#374151' }}>이메일:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{email}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#374151' }}>연락처:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{phone}</td>
            </tr>
          </table>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#374151', marginBottom: '10px' }}>예약 일정</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#374151' }}>날짜:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{date}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#374151' }}>시간:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{time}</td>
            </tr>
            {service && (
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#374151' }}>서비스:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{service}</td>
              </tr>
            )}
          </table>
        </div>
        
        {message && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#374151', marginBottom: '10px' }}>요청사항</h3>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              color: '#6b7280'
            }}>
              {message}
            </div>
          </div>
        )}
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#92400e', textAlign: 'center' }}>
            <strong>💡 관리자 페이지에서 예약을 확인하고 관리하세요</strong><br/>
            <a href="http://localhost:3001/admin" style={{ color: '#ec4899', textDecoration: 'none' }}>
              관리자 페이지 바로가기
            </a>
          </p>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '20px', 
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <p style={{ margin: 0 }}>
          경상북도 상주시 남성동 101-29번지 은파미용실<br/>
          전화: 054-535-6353
        </p>
      </div>
    </div>
  )
}





















