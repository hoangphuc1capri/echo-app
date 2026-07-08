import { QuizQuestion, CategoryInfo } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Chuông báo thức vừa tắt. Hôm nay có một bài kiểm tra mà bạn chưa ôn kỹ. Trong lúc đánh răng, điều đầu tiên bạn nghĩ đến là:",
    options: {
      A: "Chắc lát nhờ AI tóm tắt nhanh.",
      B: "Xem lại vài ý quan trọng rồi tính tiếp.",
      C: "Mình thử nhớ xem còn nhớ được những gì.",
      D: "Cứ vào làm trước, thiếu đâu bổ sung sau."
    },
    scores: { A: 1, B: 3, C: 4, D: 2 }
  },
  {
    id: 2,
    question: "Trong giờ học, thầy bất ngờ đưa ra một câu hỏi không có trong sách. Cả lớp im lặng vài giây. Nếu lúc đó được dùng điện thoại, bạn sẽ:",
    options: {
      A: "Mở AI để xem ngay đáp án.",
      B: "Tìm thử một gợi ý rồi tự trả lời.",
      C: "Muốn nghe các bạn trao đổi trước.",
      D: "Thử nói suy nghĩ của mình dù chưa chắc đúng."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 3,
    question: "Bạn vừa hoàn thành một bài viết. Trước khi nộp, bạn còn khoảng mười phút. Bạn thường:",
    options: {
      A: "Đưa toàn bộ bài vào AI để sửa.",
      B: "Nhờ AI góp ý những đoạn mình chưa chắc.",
      C: "Đọc lại xem có chỗ nào chưa hợp lý.",
      D: "Đọc thành tiếng để xem ý của mình có mạch lạc không."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 4,
    question: "Một người bạn gửi cho em câu trả lời của AI và nói: \"Cứ dùng đi, thầy không biết đâu\". Lúc đó bạn nghĩ:",
    options: {
      A: "Vậy thì nhanh hơn nhiều.",
      B: "Có thể tham khảo một chút.",
      C: "Mình muốn sửa lại theo cách hiểu của mình.",
      D: "Mình muốn tự làm hơn, dù lâu hơn."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 5,
    question: "Đến một phần kiến thức rất khó hiểu. Sau khoảng ba phút vẫn chưa nghĩ ra hướng giải quyết. bạn sẽ:",
    options: {
      A: "Mở AI ngay.",
      B: "Tìm thêm ví dụ rồi nếu cần mới hỏi AI.",
      C: "Ghi lại điều mình đã hiểu trước.",
      D: "Kiên nhẫn suy nghĩ thêm một lúc nữa."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 6,
    question: "Sau khi nhận điểm cao, điều đầu tiên bạn làm là:",
    options: {
      A: "Thở phào vì cuối cùng cũng xong.",
      B: "Xem AI đã giúp mình những phần nào.",
      C: "Đọc lại bài để biết mình làm tốt ở đâu.",
      D: "Tò mò xem nếu làm lại thì mình có thể viết hay hơn không."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 7,
    question: "Tối nay mạng Internet bị mất. bạn nhìn bài tập còn dang dở trên bàn. Cảm giác đầu tiên của bạn là:",
    options: {
      A: "Hơi hoang mang vì không thể hỏi AI.",
      B: "Tiếc vì sẽ mất nhiều thời gian hơn.",
      C: "Thôi thì thử làm đến đâu hay đến đó.",
      D: "Đây cũng là dịp để xem mình thực sự hiểu được bao nhiêu."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 8,
    question: "Cô giáo giao một đề mở và nói: \"Không có đáp án đúng tuyệt đối\". Điều đầu tiên bạn nghĩ là:",
    options: {
      A: "AI chắc sẽ có nhiều ý hay.",
      B: "Mình xem AI gợi ý trước rồi phát triển.",
      C: "Mình thử nghĩ vài hướng trước.",
      D: "Đây là cơ hội để viết theo góc nhìn của mình."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 9,
    question: "Khi xem lại bài cũ, bạn nhận ra có một ý mình từng viết chưa thật tốt. Bạn thường:",
    options: {
      A: "Đưa vào AI để viết lại.",
      B: "Xem AI sẽ sửa như thế nào.",
      C: "Tự chỉnh trước rồi mới so sánh.",
      D: "Giữ lại cả bản cũ và bản mới để xem mình tiến bộ ra sao."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 10,
    question: "Trong một buổi học nhóm, mọi người tranh luận về một vấn đề. Bạn sẽ:",
    options: {
      A: "Mở AI để tìm câu trả lời ngay.",
      B: "Chờ xem AI nói gì rồi mới phát biểu.",
      C: "Nêu suy nghĩ của mình trước rồi cùng kiểm chứng.",
      D: "Thích nghe nhiều ý kiến khác nhau trước khi kết luận."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 11,
    question: "Cuối một ngày học, nếu chỉ được giữ lại một điều, bạn mong đó là:",
    options: {
      A: "Mình đã hoàn thành hết bài tập",
      B: "Mình đã tìm được cách làm nhanh hơn.",
      C: "Mình hiểu rõ hơn một điều trước đây chưa biết.",
      D: "Mình đã tự nghĩ ra một ý tưởng mà trước đó chưa từng có."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 12,
    question: "Bạn vừa đọc xong một câu trả lời rất hay của AI. Điều đầu tiên bạn muốn làm là:",
    options: {
      A: "Dùng ngay cho bài của mình.",
      B: "Chỉnh sửa lại một chút rồi dùng.",
      C: "Ghi lại những ý mình thấy hay.",
      D: "Đóng AI lại và thử diễn đạt theo cách của mình."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 13,
    question: "Khi bắt gặp một ý kiến trái ngược với suy nghĩ của mình, bạn thường:",
    options: {
      A: "Hỏi AI xem bên nào đúng.",
      B: "Đọc xem AI phân tích thế nào.",
      C: "So sánh các lập luận của hai bên.",
      D: "Tự cân nhắc rồi mới đưa ra kết luận."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 14,
    question: "Có một hôm bạn quyết định học mà không mở AI. Sau khoảng nửa giờ, bạn cảm thấy:",
    options: {
      A: "Khá bế tắc.",
      B: "Hơi chậm hơn bình thường.",
      C: "Vất vả nhưng vẫn làm được.",
      D: "Mình suy nghĩ nhiều hơn trước."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 15,
    question: "Một người bạn nói: \"Thời nay biết dùng AI là đủ rồi\", bạn nghĩ:",
    options: {
      A: "Đúng, miễn kết quả tốt.",
      B: "Cũng có phần đúng.",
      C: "AI rất hữu ích nhưng không thể thay việc học.",
      D: "Điều quan trọng nhất vẫn là khả năng của chính mình."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 16,
    question: "Sau khi hoàn thành một bài khó, điều khiến bạn vui nhất là:",
    options: {
      A: "Cuối cùng cũng xong.",
      B: "Chắc mình sẽ được điểm cao.",
      C: "Mình đã hiểu cách giải quyết vấn đề.",
      D: "Lần sau gặp dạng này mình có thể tự làm."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 17,
    question: "Một hôm AI trả lời sai một câu hỏi mà bạn biết đáp án. Bạn sẽ:",
    options: {
      A: "Thử hỏi lại bằng cách khác.",
      B: "Tìm một AI khác để kiểm tra.",
      C: "Đối chiếu với tài liệu đáng tin cậy.",
      D: "Nhận ra rằng AI cũng cần được kiểm chứng."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 18,
    question: "Trong một buổi học, có một vấn đề khiến cả lớp tranh luận rất sôi nổi. Bạn thường:",
    options: {
      A: "Muốn biết AI kết luận thế nào.",
      B: "Xem AI như một ý kiến tham khảo.",
      C: "Lắng nghe nhiều góc nhìn rồi tự đánh giá.",
      D: "Thích tự xây dựng quan điểm của mình trước khi xem AI."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 19,
    question: "Khi nhìn lại những bài mình đã làm trong vài tháng gần đây, điều khiến bạn quan tâm nhất là:",
    options: {
      A: "Điểm số của mình.",
      B: "Mình đã hoàn thành được bao nhiêu bài.",
      C: "Mình đã tiến bộ ở điểm nào.",
      D: "Cách mình suy nghĩ đã thay đổi ra sao."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  },
  {
    id: 20,
    question: "Nếu một ngày sau này không còn được sử dụng AI trong học tập nữa, bạn nghĩ mình sẽ:",
    options: {
      A: "Rất khó thích nghi.",
      B: "Mất một thời gian để làm quen.",
      C: "Vẫn học được, chỉ chậm hơn một chút.",
      D: "Không quá lo vì mình luôn cố gắng giữ khả năng tự học."
    },
    scores: { A: 1, B: 2, C: 3, D: 4 }
  }
];

export function calculateScore(answers: number[]): { score: number; percentage: number } {
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  const percentage = Math.round((score / 80) * 100);
  return { score, percentage };
}

export function getCategory(percentage: number): CategoryInfo {
  if (percentage <= 25) {
    return {
      id: 'seed_keeper',
      name: 'The Seed Keeper',
      nameVi: 'Người giữ lửa tư duy',
      description: 'Bạn phụ thuộc hoàn toàn vào AI. Hãy từ từ tìm lại bản thân.',
      letter: `Gửi bạn,

Có lẽ bạn đã quen với việc để AI lo phần lớn công việc học tập. "Cứ hỏi AI là xong" - đó là cách bạn đang nghĩ.

Nhưng hãy thử dừng lại một chút. Mỗi lần bạn tự giải được một bài, đó không chỉ là điểm số - đó là một mảnh ghép trong bức tranh năng lực của chính bạn.

AI có thể cho bạn đáp án. Nhưng chỉ có bạn mới có thể tạo ra sự hiểu biết thực sự.

**Hay thử:**
- Dành 10 phút tự suy nghĩ trước khi hỏi AI
- Viết ý tưởng của mình ra trước khi xin gợi ý
- Thử làm một bài mà không cần AI

Bạn không cần nhanh hơn. Bạn chỉ cần thật sự hiểu.`,
      tips: [
        'Bắt đầu với 10 phút tự suy nghĩ mỗi ngày',
        'Dùng AI như người phản biện, không phải người làm hộ',
        'Ghi lại những gì bạn tự làm được'
      ]
    };
  } else if (percentage <= 50) {
    return {
      id: 'walker',
      name: 'The Walker',
      nameVi: 'Người đi trên cầu',
      description: 'Bạn có xu hướng dựa vào AI nhiều hơn tự lực. Cố gắng thêm một chút nhé!',
      letter: `Gửi bạn,

Bạn không hoàn toàn phụ thuộc vào AI, nhưng đôi khi bạn vẫn cảm thấy thoải mái khi có nó bên cạnh. Đó là điều hoàn toàn bình thường.

Trên thực tế, bạn đang ở một vị trí rất thú vị - bạn biết cách cân bằng giữa việc tự lập và việc tiếp nhận hỗ trợ. Điều quan trọng là bạn không để "thói quen" trở thành "sự phụ thuộc".

**Hay thử:**
- Trước khi hỏi AI, tự suy nghĩ ít nhất 5 phút
- Áp dụng quy tắc "một câu hỏi" - chỉ hỏi AI sau khi đã có ít nhất 1 hướng giải
- Sau mỗi lần dùng AI, tự hỏi: "Nếu không có nó, mình làm sao?"

Bạn đang đi trên cầu. Hãy giữ thăng bằng.`,
      tips: [
        'Áp dụng quy tắc Delay 5 phút trước khi hỏi AI',
        'Chỉ hỏi AI sau khi đã có ít nhất 1 hướng giải',
        'Reflection loop: Sau mỗi lần dùng AI, tự hỏi "Nếu không có nó?"'
      ]
    };
  } else if (percentage <= 75) {
    return {
      id: 'supported',
      name: 'The Supported',
      nameVi: 'Người thích hỗ trợ',
      description: 'Bạn có sự cân bằng giữa tự lập và sử dụng AI. Tiếp tục phát huy!',
      letter: `Gửi bạn,

Bạn đang ở giữa con đường - không quá phụ thuộc vào AI, cũng không hoàn toàn tự lập. Đó là một vị trí rất tốt!

AI thực sự hữu ích - nó giúp bạn tiết kiệm thời gian, kiểm tra sai sót, và đôi khi gợi mở những ý tưởng mới. Nhưng điều bạn cần nhớ là: bạn mới là người quyết định cuối cùng.

**Hay thử:**
- Trước khi xem gợi ý AI, viết ra suy nghĩ của mình
- So sánh câu trả lời của bạn với AI - bạn giỏi hơn bạn nghĩ
- Tự đánh giá bài làm trước khi nhờ AI sửa

Bạn đang làm tốt. Hãy tiếp tục như vậy!`,
      tips: [
        'Viết ý tưởng của mình trước khi xem AI gợi ý',
        'Tự đánh giá bài làm trước khi nhờ AI sửa',
        'So sánh câu trả lời của mình với AI - bạn giỏi hơn bạn nghĩ'
      ]
    };
  } else if (percentage <= 90) {
    return {
      id: 'borrowed_mind',
      name: 'The Borrowed Mind',
      nameVi: 'Người mượn trí',
      description: 'Bạn có xu hướng tự lập hơn, nhưng vẫn cần AI như một người bạn đồng hành.',
      letter: `Gửi bạn,

Bạn đang ở một nơi rất tốt! Bạn có khả năng tự lập cao, nhưng vẫn biết cách sử dụng AI như một công cụ hỗ trợ thông minh.

Điều quan trọng là bạn không để AI thay thế hoàn toàn suy nghĩ của mình. Mỗi khi bạn tự suy nghĩ trước khi xem AI, bạn đang xây dựng năng lực thật sự của bản thân.

**Hay thử:**
- Tiếp tục duy trì thói quen tự suy nghĩ trước
- Dùng AI để kiểm tra và bổ sung, không phải thay thế
- Ghi lại những gì bạn tự làm được mỗi ngày

Bạn đang làm rất tốt. Hãy tiếp tục phát huy!`,
      tips: [
        'Duy trì thói quen tự suy nghĩ trước khi hỏi AI',
        'Dùng AI như công cụ kiểm tra, không phải thay thế',
        'Ghi nhật ký những gì bạn tự làm được'
      ]
    };
  } else {
    return {
      id: 'echo_prisoner',
      name: 'The Echo Prisoner',
      nameVi: 'Người tù của tiếng vọng',
      description: 'Bạn hoàn toàn tự lập! Hãy để AI trở thành người bạn đồng hành, không phải kẻ thù.',
      letter: `Gửi bạn,

Bạn là người hoàn toàn tự lập! Điều này thật tuyệt vời - bạn có năng lực tư duy và giải quyết vấn đề rất tốt.

Nhưng hãy nhớ rằng, AI không phải là kẻ thù. Nó có thể là một người bạn đồng hành tuyệt vời nếu bạn biết cách sử dụng nó đúng cách.

**Hay thử:**
- Thử dùng AI như một người thầy gợi ý, không phải đối thủ
- Học hỏi từ những câu trả lời hay của AI
- Chia sẻ kiến thức của bạn với những người khác

Bạn đã có nền tảng vững chắc. Giờ hãy mở rộng thêm với sự hỗ trợ của AI!`,
      tips: [
        'Thử dùng AI như người thầy gợi ý',
        'Học hỏi từ những câu trả lời hay của AI',
        'Chia sẻ kiến thức với người khác'
      ]
    };
  }
}
