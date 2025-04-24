'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { benefits } from './data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function BenefitsCarousel() {
  return (
    <div className="relative">
      <div className="absolute top-1/2 -translate-y-1/2 z-10 w-full hidden md:flex">
        <button className="swiper-prev absolute bg-secondary-50 text-white hover:bg-secondary transition left-0 w-12 h-12 flex justify-center items-center rounded-full">
          <ChevronLeft size={18} />
        </button>
        <button className="swiper-next absolute bg-secondary-50 text-white hover:bg-secondary transition right-0 w-12 h-12 flex justify-center items-center rounded-full">
          <ChevronRight size={18} />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        navigation={{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }}
        pagination={{ clickable: true }}
        breakpoints={{
          1450: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 2,
          },
          480: {
            slidesPerView: 1,
          },
        }}
        className="max-w-5xl 2xl:max-w-7xl !py-4 !pb-6"
      >
        {benefits.map(benefit => (
          <SwiperSlide key={benefit.id} className="!flex !justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center lg:items-start p-3 2xl:p-6 w-full md:w-[400px]"
            >
              <div className="text-primary bg-secondary-50 w-12 h-12 justify-center flex items-center rounded-full">
                {benefit.icon}
              </div>
              <h3 className="font-title_three mt-5 font-semibold text-center lg:text-start">
                {benefit.title}
              </h3>
              <p className="font-body_one mt-4 text-center lg:text-start">{benefit.description}</p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
