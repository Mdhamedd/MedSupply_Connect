"use client";
import Image from "next/image";
import React from "react";

function Hero() {
  return (
    <section
      className="bg-white lg:grid lg:h-screen lg:place-content-center"
      dir="rtl"
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Right side - Text content */}
        <div className="md:w-1/2 text-right order-2 md:order-1">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            لا تدع المخزون <span className="text-indigo-500">ينتهي</span> مرة
            أخرى
          </h1>

          <p className="mt-6 text-gray-700 text-lg">
            أول منصة إلكترونية لربط شركات الأدوية بالصيدليات لتفادي نقص الأدوية
            وتنظيم التوريد بسهولة.
          </p>

          <div className="mt-8 flex justify-start gap-4">
            <a
              href="#"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              ابدأ الآن
            </a>

            <a
              href="#"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              تعرف أكثر
            </a>
          </div>
        </div>

        {/* Left side - Image */}
        <div className="md:w-1/2 mb-10 md:mb-0 order-1 md:order-2">
          <div className="relative">
            <div className="bg-indigo-50 rounded-full w-full h-full absolute"></div>
            <Image
              src="/Hero.svg"
              alt="Medical professionals with heart illustration"
              width={500}
              height={400}
              className="relative z-10 animate-pulse duration-1000"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
