import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { connectDB } from '@/lib/db';
import { QuizResult } from '@/models/QuizResult';
import { calculateScore, getCategory } from '@/lib/quiz-data';

const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 20) {
      return NextResponse.json(
        { success: false, error: 'Cần trả lời đủ 20 câu hỏi' },
        { status: 400 }
      );
    }

    await connectDB();

    const { score, percentage } = calculateScore(answers);
    const categoryInfo = getCategory(percentage);

    const result = await QuizResult.create({
      userId: user.userId,
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
});

const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    await connectDB();
    const results = await QuizResult.find({ userId: user.userId })
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
});

export { POST, GET };
