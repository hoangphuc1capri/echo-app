'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Users, BookOpen, Eye, Star, Quote, ChevronLeft, ChevronRight, Shield, MessageCircle, Globe, Brain, Sparkle, GraduationCap, Lightbulb } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const testimonials = [
  {
    name: 'Một học sinh THPT',
    avatar: '👤',
    content: 'Mình nhận ra mình đang lạm dụng AI quá nhiều. Giờ mình biết cách cân bằng hơn giữa tự học và sử dụng công cụ hỗ trợ.',
    rating: 5,
  },
  {
    name: 'Một phụ huynh',
    avatar: '👩',
    content: 'Con mình đã thay đổi cách tiếp cận việc học. Thay vì copy đáp án AI, bé tự tìm hiểu trước rồi mới hỏi AI để kiểm tra.',
    rating: 5,
  },
];

const features = [
  {
    icon: Brain,
    title: 'Khảo sát tự đánh giá',
    desc: '20 câu hỏi khoa học giúp bạn nhận diện mức độ phụ thuộc vào AI trong học tập',
    color: '#5C4033',
  },
  {
    icon: Lightbulb,
    title: 'Thư cá nhân hóa',
    desc: 'Nhận lời khuyên và lộ trình phù hợp dựa trên kết quả khảo sát của bạn',
    color: '#C9A227',
  },
  {
    icon: MessageCircle,
    title: 'Kết nối cộng đồng',
    desc: 'Chia sẻ và học hỏi từ những người có cùng mối quan tâm về việc học',
    color: '#2D5016',
  },
  {
    icon: Shield,
    title: 'Bảo mật & Riêng tư',
    desc: 'Dữ liệu của bạn được bảo vệ, không chia sẻ cho bất kỳ bên thứ ba nào',
    color: '#2563EB',
  },
];

const benefits = [
  {
    icon: GraduationCap,
    title: 'Phát triển tư duy độc lập',
    desc: 'Học cách tự suy nghĩ trước khi nhờ AI hỗ trợ',
  },
  {
    icon: Sparkle,
    title: 'Học tập có ý thức',
    desc: 'Sử dụng AI như công cụ, không phải bạn thay thế',
  },
  {
    icon: Heart,
    title: 'Tự tin hơn',
    desc: 'Xây dựng kiến thức thật sự của riêng bạn',
  },
];

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
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
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#C9A227]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] bg-[#4A7C23]/10 rounded-full blur-3xl"
          />
          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] right-[20%] w-4 h-4 bg-[#C9A227]/30 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] left-[15%] w-3 h-3 bg-[#4A7C23]/30 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -25, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[25%] right-[25%] w-5 h-5 bg-[#5C4033]/20 rounded-full"
          />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5EDE0] border border-[#EDE4D3] mb-10"
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
              transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 15 }}
              className="mb-10"
            >
              <Image
                src="/logo.svg"
                alt="ECHO Logo - Cây tư duy"
                width={140}
                height={140}
                className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto drop-shadow-xl"
                priority
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-[#2C1810] mb-6 tracking-tight"
            >
              ECHO
            </motion.h1>
            
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl text-[#4A3728] font-body mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Bạn đang <span className="text-[#C9A227] font-semibold">tự học</span> hay đang{' '}
              <span className="text-[#5C4033] font-semibold">để AI học giúp</span>?
            </motion.p>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg md:text-xl font-display italic text-[#6B5B4F] max-w-xl mx-auto mb-12"
            >
              "Có những câu trả lời đến rất nhanh. Nhưng không phải câu trả lời nào cũng giúp ta lớn lên."
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth">
                <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all group min-w-[220px] text-base px-8 py-3.5" aria-label="Bắt đầu khám phá ECHO">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Bắt đầu khám phá
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="#learn-more">
                <Button variant="ghost" size="lg" className="text-base px-6 py-3.5" aria-label="Tìm hiểu thêm về ECHO">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              aria-hidden="true"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-7 h-10 rounded-full border-2 border-[#6B5B4F]/30 flex items-start justify-center p-1.5"
              >
                <motion.div className="w-1.5 h-2 rounded-full bg-[#6B5B4F]/50" />
              </motion.div>
            </motion.div>
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#2C1810] mb-8 leading-tight">
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

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#F5EDE0]/50 to-transparent" aria-label="Lợi ích của ECHO">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2C1810] mb-4">
              ECHO giúp bạn
            </h2>
            <p className="text-lg text-[#6B5B4F] max-w-xl mx-auto">
              Nhận diện và thay đổi thói quen học tập
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center p-8"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md" style={{ backgroundColor: index === 0 ? '#5C4033' : index === 1 ? '#C9A227' : '#2D5016' }}>
                  <benefit.icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#2C1810] mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#6B5B4F]">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32" aria-label="Tính năng của ECHO">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2C1810] mb-4">
              Tính năng chính
            </h2>
            <p className="text-lg text-[#6B5B4F] max-w-2xl mx-auto">
              Công cụ được thiết kế để hỗ trợ bạn học tập hiệu quả hơn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#EDE4D3]/50 group"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#2C1810] mb-2 group-hover:text-[#5C4033] transition-colors">{feature.title}</h3>
                <p className="text-sm text-[#6B5B4F] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-transparent via-[#F5EDE0]/30 to-transparent" aria-label="Cảm nhận người dùng">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2C1810] mb-4">
              Chia sẻ từ cộng đồng
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#EDE4D3]" role="region" aria-label="Testimonials carousel">
              <Quote className="absolute top-6 left-6 w-10 h-10 text-[#C9A227]/15" aria-hidden="true" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#F5EDE0] flex items-center justify-center text-3xl mb-6 mx-auto">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <p className="text-lg md:text-xl text-[#2C1810] font-body leading-relaxed mb-8">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <div className="flex justify-center gap-1 mb-3" aria-label={`Đánh giá: ${testimonials[currentTestimonial].rating} sao`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonials[currentTestimonial].rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="font-semibold text-[#2C1810]">{testimonials[currentTestimonial].name}</p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2.5 rounded-full bg-[#F5EDE0] hover:bg-[#EDE4D3] transition-colors"
                  aria-label="Testimonial trước"
                >
                  <ChevronLeft className="w-5 h-5 text-[#2C1810]" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'w-6 bg-[#5C4033]' : 'bg-[#EDE4D3] hover:bg-[#d4c9b8]'}`}
                      aria-label={`Xem testimonial ${index + 1}`}
                      aria-current={index === currentTestimonial ? 'true' : undefined}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2.5 rounded-full bg-[#F5EDE0] hover:bg-[#EDE4D3] transition-colors"
                  aria-label="Testimonial tiếp theo"
                >
                  <ChevronRight className="w-5 h-5 text-[#2C1810]" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Solution Section - Tree Metaphor */}
      <section className="py-24 md:py-32" aria-label="Giải pháp - Cây tư duy">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative max-w-md mx-auto">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5C4033]/5 via-[#C9A227]/5 to-[#4A7C23]/5 rounded-3xl transform rotate-3" />
                
                {/* Tree SVG */}
                <svg viewBox="0 0 200 220" className="w-full h-auto relative z-10" aria-label="Cây tư duy - lá là AI, cành là suy nghĩ độc lập">
                  <defs>
                    <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B6914" />
                      <stop offset="100%" stopColor="#5C4033" />
                    </linearGradient>
                    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4A7C23" />
                      <stop offset="100%" stopColor="#2D5016" />
                    </linearGradient>
                    <linearGradient id="leafGold" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E5C44A" />
                      <stop offset="100%" stopColor="#C9A227" />
                    </linearGradient>
                  </defs>
                  
                  {/* Ground */}
                  <ellipse cx="100" cy="210" rx="50" ry="8" fill="#EDE4D3" />
                  
                  {/* Trunk */}
                  <path d="M92 200 L92 110 Q100 90 100 90 Q100 90 108 110 L108 200 Z" fill="url(#trunkGrad)" />
                  
                  {/* Branches */}
                  <path d="M100 140 Q70 120 55 85" stroke="#5C4033" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M100 140 Q130 120 145 85" stroke="#5C4033" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M100 115 Q80 95 70 55" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M100 115 Q120 95 130 55" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M100 95 Q100 70 100 40" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
                  
                  {/* Leaves - AI support (golden) */}
                  <circle cx="55" cy="80" r="22" fill="url(#leafGold)" />
                  <circle cx="145" cy="80" r="22" fill="url(#leafGold)" />
                  <circle cx="70" cy="50" r="18" fill="url(#leafGold)" />
                  <circle cx="130" cy="50" r="18" fill="url(#leafGold)" />
                  
                  {/* Leaves - Independent thinking (green) */}
                  <circle cx="100" cy="35" r="28" fill="url(#leafGrad)" />
                  <circle cx="80" cy="38" r="16" fill="#5A8F2A" />
                  <circle cx="120" cy="38" r="16" fill="#5A8F2A" />
                  <circle cx="95" cy="25" r="12" fill="#6BA335" />
                  <circle cx="105" cy="25" r="12" fill="#6BA335" />
                  
                  {/* Root label */}
                  <text x="100" y="218" textAnchor="middle" className="text-[8px] fill-[#6B5B4F] font-ui">Năng lực tư duy của bạn</text>
                </svg>

                {/* Floating decorations */}
                <motion.div
                  animate={{ y: [-8, 8, -8], rotate: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -right-4 text-2xl"
                  aria-hidden="true"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ y: [8, -8, 8], rotate: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-2 -left-4 text-xl"
                  aria-hidden="true"
                >
                  🌱
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2C1810] mb-6 leading-tight">
                Mỗi người là một loại cây
              </h2>
              <p className="text-lg text-[#4A3728] font-body leading-relaxed mb-8">
                ECHO sử dụng cây làm ẩn dụ: <span className="text-[#C9A227] font-semibold">lá vàng</span> là sự hỗ trợ từ AI,{' '}
                <span className="text-[#2D5016] font-semibold">lá xanh</span> là suy nghĩ độc lập của bạn.
                Cây khỏe mạnh cần cả hai - nhưng <span className="font-semibold">rễ (năng lực tư duy)</span> mới là điều quan trọng nhất.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-[#EDE4D3]/50">
                  <div className="w-11 h-11 rounded-full bg-[#E8F0E0] flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-[#2D5016]" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-[#2C1810] mb-1">Tự nhận diện</h4>
                    <p className="text-sm text-[#6B5B4F]">Hiểu rõ mức độ phụ thuộc của bạn vào AI trong học tập</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-[#EDE4D3]/50">
                  <div className="w-11 h-11 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-[#C9A227]" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-[#2C1810] mb-1">Lộ trình cá nhân</h4>
                    <p className="text-sm text-[#6B5B4F]">Nhận lời khuyên phù hợp với hoàn cảnh của bạn</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-[#EDE4D3]/50">
                  <div className="w-11 h-11 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-[#2C1810] mb-1">Kết nối cộng đồng</h4>
                    <p className="text-sm text-[#6B5B4F]">Chia sẻ kinh nghiệm với những người cùng mối quan tâm</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-28 md:py-36 relative overflow-hidden" aria-label="Đăng ký ECHO">
        <div className="absolute inset-0 bg-[#FAF6F0]" aria-hidden="true" />
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#4A7C23]/10 rounded-full blur-3xl"
          />
        </div>
        
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
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

            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#2C1810] mb-5 leading-tight">
              Bắt đầu hành trình
            </h2>
            
            <p className="text-xl md:text-2xl text-[#4A3728] font-body mb-10 leading-relaxed">
              10 phút để hiểu rõ hơn về mối quan hệ của bạn với AI
            </p>
            
            <Link href="/auth">
              <Button 
                size="lg" 
                className="shadow-xl hover:shadow-2xl transition-all duration-300 group text-lg px-10 py-3.5"
                aria-label="Bắt đầu khám phá ECHO miễn phí"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </Link>

            <p className="mt-6 text-sm text-[#6B5B4F] font-ui">
              Miễn phí • Không cần thẻ tín dụng
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#2C1810]" role="contentinfo">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="ECHO Logo"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <div>
                <span className="font-display text-xl font-bold text-white">ECHO</span>
                <p className="text-xs text-white/60">Khám phá bản thân</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-white/70">
                Dự án nghiên cứu khoa học cấp tỉnh 2026-2027
              </p>
              <p className="text-xs text-white/50 mt-1">
                Lĩnh vực: Khoa học xã hội & Hành vi
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Globe className="w-4 h-4 text-white/50" aria-hidden="true" />
              <span className="text-xs text-white/50">
                Made with care for students
              </span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
