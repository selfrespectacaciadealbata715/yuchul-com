import { NextRequest, NextResponse } from 'next/server';
import { generateRemovalRequestEmail } from '@/lib/removal-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dataController, userData, dataTypes, region = 'korea' } = body;

    // Generate removal request email
    const emailTemplate = generateRemovalRequestEmail(
      dataController,
      userData,
      dataTypes,
      region
    );

    // In production, you would send this email using a service like SendGrid, Nodemailer, etc.
    // For now, we'll just return the template

    return NextResponse.json(
      {
        success: true,
        requestId: 'req_' + Math.random().toString(36).substr(2, 9),
        template: emailTemplate,
        message: '삭제 요청 템플릿이 생성되었습니다.',
        instructions: [
          `${emailTemplate.to}로 이메일을 발송하세요.`,
          '제목: ' + emailTemplate.subject,
          '본문: 위의 템플릿을 사용하세요.',
          '개인정보가 포함되어 있으므로 신중하게 발송해주세요.',
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Removal request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '삭제 요청 생성 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get removal request status
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('id');

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Mock status check
    return NextResponse.json(
      {
        success: true,
        requestId,
        status: '진행중',
        progress: 45,
        createdAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get removal status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '상태 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
