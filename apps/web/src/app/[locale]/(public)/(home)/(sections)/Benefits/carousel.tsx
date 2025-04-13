'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
/* import { Navigation, Pagination, A11y } from 'swiper/modules'; */
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { benefits } from './data';

export function BenefitsCarousel() {
  return (
    <Swiper
      /* modules={[Navigation, Pagination, A11y]}
      navigation
      pagination={{ clickable: true }} */
      breakpoints={{
        1024: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 2,
        },
        480: {
          slidesPerView: 1,
        },
      }}
    >
      {benefits.map(benefit => (
        <SwiperSlide
          key={benefit.id}
          className=" flex flex-col items-center lg:items-start hover:transform hover:scale-105 transition-transform duration-300"
        >
          <div className="w-[265px]">
            <div className="text-primary bg-secondary-50 w-12 h-12 justify-center flex items-center rounded-full">
              {benefit.icon}
            </div>
            <h3 className="font-title_three mt-5 font-semibold text-center lg:text-start">
              {benefit.title}
            </h3>
            <p className="font-body_one mt-4 text-center lg:text-start">{benefit.description}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
