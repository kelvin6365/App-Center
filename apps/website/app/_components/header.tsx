'use client';
import React, { useState } from 'react';
import cn from 'classnames';
import { useScroll } from 'framer-motion';

const Header = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const ref = React.useRef<HTMLHeadingElement>(null);
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {};

  const { scrollY } = useScroll();
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);

  return (
    <header
      ref={ref}
      className={cn(
        'fixed top-0 w-full h-16 z-[999]',
        y > height &&
          'border-b shadow bg-white/70 dark:bg-[rgba(29,32,37,0.7)] backdrop-blur-2xl'
      )}
    >
      <div className="container flex items-center justify-center h-full max-w-6xl px-8 mx-auto sm:justify-between xl:px-0">
        <a
          href="/"
          className="relative flex items-center h-full font-black leading-none"
        >
          <svg
            className={cn('w-auto h-6 text-indigo-600 fill-current')}
            viewBox="0 0 194 116"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fillRule="evenodd">
              <path d="M96.869 0L30 116h104l-9.88-17.134H59.64l47.109-81.736zM0 116h19.831L77 17.135 67.088 0z"></path>
              <path d="M87 68.732l9.926 17.143 29.893-51.59L174.15 116H194L126.817 0z"></path>
            </g>
          </svg>
          <span className="ml-3 text-xl text-gray-800">
            App Center<span className="text-pink-500">.</span>
          </span>
        </a>

        <nav
          id="nav"
          className={cn(
            'absolute top-0 left-0 z-50 flex flex-col items-center justify-between w-full h-64 pt-5 mt-24 text-sm text-gray-800 bg-white border-t border-gray-200 md:w-auto md:flex-row md:h-24 lg:text-base md:bg-transparent md:mt-0 md:border-none md:py-0 md:flex md:relative',
            !isOpenMenu && 'hidden'
          )}
        >
          <a
            href="#"
            className="ml-0 mr-0 font-bold duration-100 md:ml-12 md:mr-3 lg:mr-8 transition-color hover:text-indigo-600"
          >
            Home
          </a>
          <a
            href="#features"
            className="mr-0 font-bold duration-100 md:mr-3 lg:mr-8 transition-color hover:text-indigo-600"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="mr-0 font-bold duration-100 md:mr-3 lg:mr-8 transition-color hover:text-indigo-600"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="font-bold duration-100 transition-color hover:text-indigo-600"
          >
            Testimonials
          </a>
          <div className="flex flex-col w-full font-medium border-t border-gray-200 md:hidden">
            <a
              href="#_"
              className="w-full py-2 font-bold text-center text-pink-500"
            >
              Login
            </a>
            <a
              href="#_"
              className="relative inline-block w-full px-5 py-3 text-sm leading-none text-center text-white bg-indigo-700 fold-bold"
            >
              Get Started
            </a>
          </div>
        </nav>

        <div className="absolute left-0 flex-col items-center justify-center hidden w-full pb-8 mt-48 border-b border-gray-200 md:relative md:w-auto md:bg-transparent md:border-none md:mt-0 md:flex-row md:p-0 md:items-end md:flex md:justify-between">
          <a
            href="#_"
            className={cn(
              'relative z-40 px-3 py-2 mr-0 text-sm font-bold text-white md:px-5 sm:mr-3 md:mt-0',
              y > height && 'lg:text-black'
            )}
          >
            Login
          </a>
          <a
            href="#_"
            className={cn(
              'relative z-40 inline-block w-auto h-full px-5 py-3 text-sm font-bold leading-none text-white transition-all duration-300 bg-indigo-700 rounded shadow-md fold-bold lg:bg-white lg:text-indigo-700 sm:w-full lg:shadow-none hover:shadow-xl',
              y > height && 'lg:text-white lg:bg-sky-500 bg-sky-500'
            )}
          >
            Get Started
          </a>
        </div>

        <div
          id="nav-mobile-btn"
          className={cn(
            'absolute top-0 right-0 z-50 block w-6 mt-8 mr-10 cursor-pointer select-none md:hidden sm:mt-10',
            isOpenMenu && 'close'
          )}
          onClick={() => setIsOpenMenu(!isOpenMenu)}
        >
          <span className="block w-full h-1 mt-2 duration-200 transform bg-gray-800 rounded-full sm:mt-1"></span>
          <span className="block w-full h-1 mt-1 duration-200 transform bg-gray-800 rounded-full"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
