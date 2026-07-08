import mongoose, { Schema, model, models } from 'mongoose';
import { QuizCategory } from '@/types';

const quizResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: {
    type: [Number],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['seed_keeper', 'walker', 'supported', 'hidden_dependent', 'ai_living'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const QuizResult = models.QuizResult || model('QuizResult', quizResultSchema);
