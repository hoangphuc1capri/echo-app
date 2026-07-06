import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { QuizResult } from '@/models/QuizResult';
import { calculateScore, getCategory } from '@/lib/quiz-data';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Không có token' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 20) {
      return NextResponse.json(
        { success: false, error: 'Cần trả lời đủ 20 câu hỏi' },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate score
    const { score, percentage } = calculateScore(answers);
    const categoryInfo = getCategory(percentage);

    // Save result
    const result = await QuizResult.create({
      userId: payload.userId,
      answers,
      score,
      percentage,
      category: categoryInfo.id,
    });

    return NextResponse.json({
      success: true,
      data: {
        result: {
          _id: result._id,
          score,
          percentage,
          category: categoryInfo,
        },
      },
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Không có token' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    await connectDB();
    const results = await QuizResult.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .select('-answers')
      .limit(10);

    return NextResponse.json({
      success: true,
      data: { results },
    });
  } catch (error) {
    console.error('Quiz history error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
