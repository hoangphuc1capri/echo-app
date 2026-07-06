import { QuizQuestion, CategoryInfo } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Chuông báo thức vừa reo. Hôm nay có một bài kiểm tra mà bạn chưa ôn kỹ. Trong lúc dậnh răng, điều đầu tiên bạn nghĩ đến là:",
    options: {
      A: "Chắc let nhờ AI tóm tắt nhanh.",
      B: "Xem lại với ý quan trọng rồi tính tiếp.",
      C: "Mình thử nhớ xem còn nhớ được những gì.",
      D: "Cứ vào làm trước, thiếu đâu bổ sung sau."
    },
    scores: { A: 4, B: 2, C: 1, D: 3 }
  },
  {
    id: 2,
    question: "Trong giờ học, thầy bất ngờ đưa ra một câu hỏi không có trong sách. Cả lớp im lặng với giấy. Nếu lúc đó được dùng điện thoại, bạn sẽ:",
    options: {
      A: "Mở AI để xem ngay đáp án.",
      B: "Tìm thêm một chút rồi tự trả lời.",
      C: "Muốn nghe các bạn trao đổi trước.",
      D: "Thử suy nghĩ của mình đã chưa."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 3,
    question: "Bạn vừa hoàn thành một bài viết. Trước khi nộp, bạn còn khoảng mười phút. Bạn thường:",
    options: {
      A: "Đưa toàn bộ bài vào AI để sửa.",
      B: "Nhờ AI gợi ý những đoạn mình chưa chắc.",
      C: "Đọc lại xem có chỗ nào chưa hợp lý.",
      D: "Đọc thành tiếng để xem ý của mình có mạch lạc không."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 4,
    question: "Một người bạn gửi cho em câu trả lời của AI và nói: \"Cứ dùng đi, thấy không biết đâu\". Lúc đó bạn nghĩ:",
    options: {
      A: "Vậy thì nhanh hơn nhiều.",
      B: "Có thể tham khảo một chút.",
      C: "Mình muốn sửa lại theo cách hiểu của mình.",
      D: "Mình muốn tự làm hơn, dù lâu hơn."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 5,
    question: "Đến một phần kiến thức rất khó hiểu. Sau khoảng ba phút vẫn chưa nghĩ ra hướng giải quyết. Bạn sẽ:",
    options: {
      A: "Mở AI ngay.",
      B: "Tìm thêm và dễ rồi nếu cần mới hỏi AI.",
      C: "Ghi lại điều mình đã hiểu trước.",
      D: "Kiên nhẫn suy nghĩ thêm một lúc nữa."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 6,
    question: "Sau khi nhận điểm cao, điều đầu tiên bạn làm là:",
    options: {
      A: "Thở phào và cuối cùng cũng xong.",
      B: "Xem AI đã giúp mình những phần nào.",
      C: "Đọc lại bài để biết mình làm tốt ở đâu.",
      D: "Tự mình xem nếu làm lại thì mình có thể viết hay hơn không."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 7,
    question: "Tối nay mạng Internet bị mất. Bạn nhìn bài tập còn dang dở trên bàn. Cảm giác đầu tiên của bạn là:",
    options: {
      A: "Hơi hoang mang và không thể hỏi AI.",
      B: "Tiếc và sẽ mất nhiều thời gian hơn.",
      C: "Thì thôi thể làm đến đâu hay đến đó.",
      D: "Đây là cơ hội để xem mình thực sự hiểu được bao nhiêu."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 8,
    question: "Cô giáo giao một đề mở và nói: \"Không có đáp án đúng tuyệt đối\". Điều đầu tiên bạn nghĩ là:",
    options: {
      A: "AI chắc sẽ có nhiều ý hay.",
      B: "Mình xem AI gợi ý trước rồi phát triển.",
      C: "Mình thử nghi với hướng tự có.",
      D: "Đây là cơ hội để viết theo góc nhìn của mình."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 9,
    question: "Khi xem lại bài cuối, bạn nhận ra có một ý mình từng viết chưa thật tốt. Bạn thường:",
    options: {
      A: "Đưa vào AI để viết lại.",
      B: "Xem AI sẽ sửa như thế nào.",
      C: "Tự chỉnh trước rồi mới so sánh.",
      D: "Giữ lại cả bài cũ và bài mới để xem mình tiến bộ ra sao."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 10,
    question: "Trong một buổi học nhóm, mọi người tranh luận về một vấn đề. Bạn sẽ:",
    options: {
      A: "Mở AI để tìm câu trả lời ngay.",
      B: "Chỉ xem AI nói gì rồi mới phát biểu.",
      C: "Nếu suy nghĩ của mình trước rồi cùng kiểm chứng.",
      D: "Thích nghe nhiều ý kiến khác nhau trước khi kết luận."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 11,
    question: "Cuối một ngày học, nếu chỉ được giữ lại một điều, bạn mong đợi là:",
    options: {
      A: "Mình đã hoàn thành hết bài tập.",
      B: "Mình đã tìm được cách làm nhanh hơn.",
      C: "Mình hiểu ra hơn một điều trước đây chưa biết.",
      D: "Mình đã tự nghĩ ra một ý tưởng mà trước đây chưa từng có."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 12,
    question: "Bạn vừa đọc xong một câu trả lời rất hay của AI. Điều đầu tiên bạn muốn làm là:",
    options: {
      A: "Dùng ngay cho bài của mình.",
      B: "Chỉnh sửa lại một chút rồi dùng.",
      C: "Ghi lại những ý mình thấy hay.",
      D: "Dùng AI lại và thử diễn đạt theo cách của mình."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
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
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 14,
    question: "Có một hôm bạn quyết định học mà không mở AI. Sau khoảng nửa giờ, bạn cảm thấy:",
    options: {
      A: "Khá bất tiện.",
      B: "Hơi chậm hơn bình thường.",
      C: "Vất vả nhưng vẫn làm được.",
      D: "Mình suy nghĩ nhiều hơn trước."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
  },
  {
    id: 15,
    question: "Một người bạn nói: \"Thời nay biết dùng AI là dễ rồi\", bạn nghĩ:",
    options: {
      A: "Đúng, miễn là kết quả tốt.",
      B: "Cũng có phần đúng.",
      C: "AI rất hữu ích nhưng không thể thay việc học.",
      D: "Điều quan trọng nhất vẫn là khả năng của chính mình."
    },
    scores: { A: 4, B: 3, C: 2, D: 1 }
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
    scores: { A: 4, B: 3, C: 2, D: 1 }
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
    scores: { A: 4, B: 3, C: 2, D: 1 }
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
    scores: { A: 4, B: 3, C: 2, D: 1 }
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
    scores: { A: 4, B: 3, C: 2, D: 1 }
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
    scores: { A: 4, B: 3, C: 2, D: 1 }
  }
];

export function calculateScore(answers: number[]): { score: number; percentage: number } {
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  const percentage = Math.round((score / 80) * 100);
  return { score, percentage };
}

export function getCategory(percentage: number): CategoryInfo {
  if (percentage <= 20) {
    return {
      id: 'seed_keeper',
      name: 'The Seed Keeper',
      nameVi: 'Người giữ lửa tư duy',
      description: 'Bạn vẫn giữ được ngọn lửa đầu tiên. Đừng để tốc độ của thế giới làm nó tắt đi.',
      letter: `Gửi bạn,

Có lẽ bạn đã quen với việc tự mình vật lộn với những bài toán khó. Đôi khi nó mệt mỏi, đôi khi bạn tự hỏi "Tại sao không dùng AI cho nhanh?".

Nhưng hãy nhìn lại xem: Mỗi lần bạn tự giải được một bài, đó không chỉ là điểm số - đó là một mảnh ghép trong bức tranh năng lực của chính bạn.

AI có thể cho bạn đáp án. Nhưng chỉ có bạn mới có thể tạo ra sự hiểu biết thực sự.

**Hay thử:**
- Dành 10 phút tự suy nghĩ trước khi hỏi AI
- Viết ý tưởng của mình ra trước khi xin gợi ý
- Phản biện ít nhất 1 lần mỗi câu trả lời AI đưa ra

Bạn không cần nhanh hơn. Bạn chỉ cần thật sự hiểu.`,
      tips: [
        'Duy trì thói quen tự học ít nhất 70% thời gian',
        'Ghi nhật ký tư duy mỗi ngày',
        'Sử dụng AI như người phản biện, không phải người làm hộ'
      ]
    };
  } else if (percentage <= 40) {
    return {
      id: 'walker',
      name: 'The Walker',
      nameVi: 'Người đi trên cầu',
      description: 'Bạn đang đi trên cây cầu giữa tiến bộ và trưởng thành. Giữ thăng bằng.',
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
  } else if (percentage <= 60) {
    return {
      id: 'supported',
      name: 'The Supported',
      nameVi: 'Người thích hỗ trợ',
      description: 'AI là công cụ hữu ích, nhưng không thể thay thế bạn. Hãy tự tin hơn.',
      letter: `Gửi bạn,

Có vẻ bạn đã quen với việc sử dụng AI như một người bạn đồng hành đáng tin cậy. Và thật ra, điều đó không xấu.

AI thực sự hữu ích - nó giúp bạn tiết kiệm thời gian, kiểm tra sai sót, và đôi khi gợi mở những ý tưởng mới. Nhưng điều bạn cần nhớ là: bạn mới là người quyết định cuối cùng.

Khi điểm số cao nhưng bạn cảm thấy "hơi trống rỗng", đó là tín hiệu cho thấy bạn cần tự tin hơn vào chính mình.

**Hay thử:**
- Trước khi xem gợi ý AI, viết ra suy nghĩ của mình
- So sánh câu trả lời của bạn với AI - bạn giỏi hơn bạn nghĩ
- Tự đánh giá bài làm trước khi nhờ AI sửa

Bạn không cần AI để giỏi. Bạn đã giỏi sẵn.`,
      tips: [
        'Viết ý tưởng của mình trước khi xem AI gợi ý',
        'Tự đánh giá bài làm trước khi nhờ AI sửa',
        'So sánh câu trả lời của mình với AI - bạn giỏi hơn bạn nghĩ'
      ]
    };
  } else if (percentage <= 80) {
    return {
      id: 'borrowed_mind',
      name: 'The Borrowed Mind',
      nameVi: 'Người mượn trí',
      description: 'Bạn đang mang một bộ não đi vay. Hãy đòi lại bộ não của chính mình.',
      letter: `Gửi bạn,

Có lẽ bạn đã nhận ra điều này: khi không có AI, bạn cảm thấy bất an. Khi nhận được điểm cao, bạn tự hỏi "Đó là do mình hay do AI?".

Đó là cảm giác của người đang mang một "bộ não mượn". Và đây là lúc để đòi lại bộ não thật của bạn.

Mỗi khi bạn chọn "Copy & Paste" thay vì suy nghĩ, bạn đang từ bỏ một cơ hội để phát triển. Điểm số cao là kết quả tức thời, nhưng năng lực thật sự mới là tài sản vĩnh viễn.

**Hay thử:**
- 2 ngày/tuần không dùng AI - bắt đầu từ từ
- Mỗi ngày 1 bài tập tự giải không hỗ trợ
- Ghi lại lỗi sai thay vì để AI sửa lỗi

Bộ não của bạn đang chờ được đánh thức. Hãy bắt đầu hôm nay.`,
      tips: [
        '2 ngày/tuần không dùng AI - bắt đầu từ từ',
        'Mỗi ngày 1 bài tập tự giải hoàn toàn',
        'Ghi lại lỗi sai thay vì để AI sửa - Error Journal'
      ]
    };
  } else {
    return {
      id: 'echo_prisoner',
      name: 'The Echo Prisoner',
      nameVi: 'Người tù của tiếng vọng',
      description: 'Mỗi chiến thắng đều đến từ tiếng vọng. Đã đến lúc nghe thấy chính mình.',
      letter: `Gửi bạn,

Nếu mọi câu trả lời đều đến từ AI, nếu mọi bài viết đều do AI viết, nếu mọi suy nghĩ đều là phản chiếu của máy móc... thì bạn đang ở đâu?

Bạn có thể đang đạt điểm cao, hoàn thành bài tập nhanh chóng, được khen ngợi vì những "thành tích" ấn tượng. Nhưng sâu bên trong, có lẽ bạn cũng cảm nhận được sự trống rỗng.

Đó là vì bạn đang xây dựng trên nền móng của người khác. Và khi đối mặt với những thử thách thực sự - những thứ không có đáp án trên mạng - bạn có thể sẽ thấy mình không có gì để dựa vào.

**Hay thử:**
- 7 ngày giảm 80% sử dụng AI - bắt đầu ngay hôm nay
- Mỗi ngày 20 phút giải quyết vấn đề KHÔNG có hỗ trợ
- Viết lại: "Điều gì mình thật sự giỏi? Điều gì AI không thể thay thế mình?"

Hành trình phục hồi này không dễ dàng, nhưng nó sẽ đáng giá. Bạn xứng đáng được sống với những suy nghĩ của chính mình.`,
      tips: [
        'Digital Detox AI: 7 ngày giảm 80% sử dụng',
        'Slow Thinking Ritual: Mỗi ngày 20 phút không hỗ trợ',
        'Identity Reconstruction: Viết lại "Điều gì mình thật sự giỏi?"'
      ]
    };
  }
}
