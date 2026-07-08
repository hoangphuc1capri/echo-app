'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Users, BookOpen, Eye, Star, Quote, ChevronLeft, ChevronRight, Zap, Shield, MessageCircle, Globe } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const testimonials = [
  {
    name: 'Minh Anh',
    role: 'Sinh viên năm 3, ĐH Bách Khoa',
    avatar: '👩‍🎓',
    content: 'ECHO giúp mình nhận ra mình đang quá phụ thuộc vào AI. Giờ mình biết cách cân bằng hơn.',
    rating: 5,
  },
  {
    name: 'Hoàng Nam',
    role: 'Học sinh lớp 12, TP.HCM',
    avatar: '👨‍💻',
    content: 'Khảo sát rất nhanh, thư cá nhân hóa rất sâu. Mình đã thay đổi cách học hoàn toàn.',
    rating: 5,
  },
  {
    name: 'Thu Hà',
    role: 'Giảng viên, ĐH Sư Phạm',
    avatar: '👩‍🏫',
    content: 'Một công cụ hữu ích để giáo viên hiểu thói quen học tập của sinh viên.',
    rating: 5,
  },
];

const stats = [
  { value: '1,234+', label: 'Người dùng', icon: Users },
  { value: '5,678+', label: 'Lượt khảo sát', icon: BookOpen },
  { value: '4.9/5', label: 'Đánh giá', icon: Star },
  { value: '100%', label: 'Miễn phí', icon: Zap },
];

const features = [
  {
    icon: BookOpen,
    title: 'Khảo sát thông minh',
    desc: '20 câu hỏi khoa học, 10 phút để hiểu rõ bản thân',
    color: '#5C4033',
  },
  {
    icon: MessageCircle,
    title: 'Phòng trò chuyện ẩn danh',
    desc: 'Kết nối với người cùng cảm xúc, an toàn và tôn trọng',
    color: '#2D5016',
  },
  {
    icon: Shield,
    title: 'Bảo mật tuyệt đối',
    desc: 'Dữ liệu cá nhân được mã hóa, không chia sẻ cho bên thứ ba',
    color: '#C9A227',
  },
  {
    icon: Globe,
    title: 'Hỗ trợ đa ngôn ngữ',
    desc: 'Sẵn sàng cho người dùng quốc tế với giao diện Tiếng Anh',
    color: '#2563EB',
  },
];

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" role="main">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden" 
        aria-label="Hero section - Giới thiệu ECHO"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#4A7C23]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-1/4 w-8 h-8 bg-[#C9A227]/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 left-1/3 w-6 h-6 bg-[#4A7C23]/20 rounded-full"
          />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5EDE0] border border-[#EDE4D3] mb-8"
              role="status"
            >
              <Sparkles className="w-4 h-4 text-[#C9A227]" aria-hidden="true" />
              <span className="text-sm font-ui text-[#6B5B4F]">
                Dự án nghiên cứu khoa học 2026-2027
              </span>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <Image
                  src="/logo.svg"
                  alt="ECHO Logo - Cây tư duy"
                  width={120}
                  height={120}
                  className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 drop-shadow-xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-[#2C1810] mb-4 tracking-tight"
            >
              ECHO
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-lg md:text-xl text-[#4A3728] font-body mb-6 max-w-xl mx-auto"
            >
              Khám phá mối quan hệ của bạn với AI
            </motion.p>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl text-[#4A3728] font-body mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Bạn đang <span className="text-[#C9A227] font-semibold">tự học</span> hay đang{' '}
              <span className="text-[#5C4033] font-semibold">để AI học giúp</span>?
            </motion.p>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl font-display italic text-[#6B5B4F] max-w-xl mx-auto mb-12"
            >
              "Có những câu trả lời đến rất nhanh. Nhưng không phải câu trả lời nào cũng giúp ta lớn lên."
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth">
                <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all group min-w-[200px]" aria-label="Bắt đầu khám phá ECHO">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Bắt đầu khám phá
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="#learn-more">
                <Button variant="ghost" size="lg" aria-label="Tìm hiểu thêm về ECHO">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              aria-hidden="true"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 rounded-full border-2 border-[#6B5B4F]/30 flex items-start justify-center p-2"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-[#6B5B4F]/50" />
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-white/50 backdrop-blur-sm" aria-label="Thống kê ECHO">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#5C4033]" aria-hidden="true" />
                <div className="text-3xl md:text-4xl font-bold text-[#2C1810]">{stat.value}</div>
                <div className="text-sm text-[#6B5B4F]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Problem Section */}
      <section id="learn-more" className="py-24 md:py-32 relative" aria-label="Vấn đề Thành tựu rỗng">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#2C1810] mb-8">
              "Thành tựu rỗng" - Bạn có đang mắc phải?
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl text-[#4A3728] font-body leading-relaxed">
              <p>
                Bạn nhờ AI giải bài toán và nhận kết quả hoàn hảo. GPA cao, bài tập điểm tốt, thầy cô khen ngợi...
              </p>
              <p>
                Nhưng khi ngồi một mình, bạn tự hỏi: <span className="text-[#C9A227] font-semibold">"Mình thực sự biết gì?"</span>
              </p>
              <p>
                Đó là <span className="text-[#8B2635] font-semibold">"Thành tựu rỗng"</span> - những thành tích mà bạn không thực sự sở hữu.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[#F5EDE0] to-transparent" aria-label="Tính năng của ECHO">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2C1810] mb-4">
              Tại sao chọn ECHO?
            </h2>
            <p className="text-lg text-[#6B5B4F] max-w-2xl mx-auto">
              Công cụ được nghiên cứu khoa học, giúp bạn hiểu rõ hơn về bản thân
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-md"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#2C1810] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6B5B4F]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32" aria-label="Cảm nhận người dùng">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2C1810] mb-4">
              Họ nói gì về ECHO?
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl" role="region" aria-label="Testimonials carousel">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-[#C9A227]/20" aria-hidden="true" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{testimonials[currentTestimonial].avatar}</div>
                  <p className="text-xl md:text-2xl text-[#2C1810] font-body italic leading-relaxed mb-6">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <div className="flex justify-center gap-1 mb-4" aria-label={`Đánh giá: ${testimonials[currentTestimonial].rating} sao`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="font-semibold text-[#2C1810]">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-[#6B5B4F]">{testimonials[currentTestimonial].role}</p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-[#F5EDE0] hover:bg-[#EDE4D3] transition-colors"
                  aria-label="Testimonial trước"
                >
                  <ChevronLeft className="w-5 h-5 text-[#2C1810]" />
                </button>
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentTestimonial ? 'w-6 bg-[#5C4033]' : 'bg-[#EDE4D3]'}`}
                      aria-label={`Xem testimonial ${index + 1}`}
                      aria-current={index === currentTestimonial ? 'true' : undefined}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-[#F5EDE0] hover:bg-[#EDE4D3] transition-colors"
                  aria-label="Testimonial tiếp theo"
                >
                  <ChevronRight className="w-5 h-5 text-[#2C1810]" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Solution Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[#F5EDE0] to-transparent" aria-label="Giải pháp - Cây tư duy">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5C4033]/5 to-[#4A7C23]/5 rounded-3xl" />
                  <svg viewBox="0 0 200 200" className="w-full h-auto" aria-label="Illustration of a healthy tree representing independent thinking">
                    <defs>
                      <linearGradient id="trunkGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B6914" />
                        <stop offset="100%" stopColor="#5C4033" />
                      </linearGradient>
                      <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4A7C23" />
                        <stop offset="100%" stopColor="#2D5016" />
                      </linearGradient>
                    </defs>
                    <path d="M95 180 L95 100 Q100 80 100 80 Q100 80 105 100 L105 180 Z" fill="url(#trunkGrad2)" />
                    <path d="M100 120 Q70 100 60 70" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M100 120 Q130 100 140 70" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M100 100 Q85 80 80 50" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M100 100 Q115 80 120 50" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="60" cy="65" r="25" fill="url(#leafGrad2)" />
                    <circle cx="140" cy="65" r="25" fill="url(#leafGrad2)" />
                    <circle cx="100" cy="40" r="30" fill="url(#leafGrad2)" />
                    <circle cx="80" cy="45" r="15" fill="#5A8F2A" />
                    <circle cx="120" cy="45" r="15" fill="#5A8F2A" />
                  </svg>
                  <motion.div
                    animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-10 left-10 text-2xl"
                    aria-hidden="true"
                  >
                    🍃
                  </motion.div>
                  <motion.div
                    animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute bottom-20 right-10 text-xl"
                    aria-hidden="true"
                  >
                    🍂
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2C1810] mb-6">
                Mỗi người là một loại cây
              </h2>
              <p className="text-lg text-[#4A3728] font-body leading-relaxed mb-8">
                ECHO sử dụng cây làm ẩn dụ: <span className="text-[#2D5016] font-semibold">cành</span> là suy nghĩ độc lập,{' '}
                <span className="text-[#C9A227] font-semibold">lá</span> là sự hỗ trợ từ bên ngoài. 
                Cây khỏe mạnh cần cả hai - nhưng rễ (năng lực tư duy của bạn) mới là điều quan trọng nhất.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#E8F0E0] flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-[#2D5016]" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-[#2C1810]">Tự nhận diện</h4>
                    <p className="text-sm text-[#6B5B4F]">Hiểu rõ mức độ phụ thuộc của bạn vào AI</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-[#C9A227]" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-[#2C1810]">Thư cá nhân hóa</h4>
                    <p className="text-sm text-[#6B5B4F]">Lời khuyên được viết riêng cho bạn</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-[#2C1810]">Kết nối cộng đồng</h4>
                    <p className="text-sm text-[#6B5B4F]">Chia sẻ với những người cùng cảm xúc</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 relative overflow-hidden" aria-label="Đăng ký ECHO">
        <div className="absolute inset-0 bg-[#FAF6F0]" aria-hidden="true" />
        
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-8"
              aria-hidden="true"
            >
              <Image
                src="/logo.svg"
                alt=""
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#2C1810] mb-6">
              Bắt đầu hành trình
            </h2>
            
            <p className="text-xl md:text-2xl text-[#4A3728] font-body mb-12 max-w-xl mx-auto leading-relaxed">
              10 phút để hiểu rõ hơn về mối quan hệ của bạn với AI
            </p>
            
            <Link href="/auth">
              <Button 
                size="lg" 
                className="shadow-xl hover:shadow-2xl transition-all group text-lg px-10"
                aria-label="Đăng ký ECHO miễn phí"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                Đăng ký miễn phí
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </Link>

            <p className="mt-6 text-sm text-[#6B5B4F] font-ui">
              Không cần thẻ tín dụng • Miễn phí vĩnh viễn
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#EDE4D3]" role="contentinfo">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="ECHO Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <span className="font-display text-xl font-bold text-[#2C1810]">ECHO</span>
                <p className="text-xs text-[#6B5B4F]">Khám phá bản thân</p>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <p className="text-sm text-[#6B5B4F]">
                Dự án nghiên cứu khoa học cấp tỉnh năm học 2026-2027
              </p>
              <p className="text-xs text-[#6B5B4F] opacity-70 mt-1">
                Lĩnh vực: Khoa học xã hội & Hành vi
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#6B5B4F] opacity-70">
                Made with 💚 for students
              </span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
