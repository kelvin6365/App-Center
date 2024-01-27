import React from 'react';

const Pricing = () => {
  return (
    <div className="relative px-8 py-10 bg-white border-t border-gray-200 md:py-16 lg:py-24 xl:py-40 xl:px-0">
      <div
        id="pricing"
        className="container flex flex-col items-center h-full max-w-6xl mx-auto"
      >
        <h2 className="my-5 text-base font-medium tracking-tight text-indigo-500 uppercase">
          Our Pricing
        </h2>
        <h3 className="w-full max-w-2xl px-5 px-8 mt-2 text-2xl font-black leading-tight text-center text-gray-900 sm:mt-0 sm:px-0 sm:text-6xl md:px-0">
          Simple, Transparent Pricing for Everyone
        </h3>

        <div className="max-w-full mx-auto md:max-w-6xl sm:px-8">
          <div className="relative flex flex-col items-center block sm:flex-row">
            <div className="relative z-0 w-11/12 max-w-sm my-8 border border-gray-200 rounded-lg sm:w-3/5 lg:w-1/3 sm:my-5 md:-mr-4">
              <div className="overflow-hidden text-black bg-white border-t border-gray-100 rounded-lg shadow-sm">
                <div className="block max-w-sm px-8 mx-auto mt-5 text-sm text-left text-black sm:text-md lg:px-6">
                  <h3 className="p-3 text-lg font-bold tracking-wide text-center uppercase">
                    Basic<span className="ml-2 font-light">Plan</span>
                  </h3>
                  <h4 className="flex items-center justify-center pb-6 text-4xl font-bold text-center text-gray-900">
                    <span className="mr-1 -ml-2 text-lg text-gray-700">$</span>
                    48
                  </h4>
                  <p className="text-sm text-gray-600">
                    In our basic plan you can take advantage of all these
                    features below.
                  </p>
                </div>

                <div className="flex flex-wrap px-6 mt-8">
                  <ul>
                    <li className="flex items-center">
                      <div className="p-2 text-green-500 rounded-full fill-current ">
                        <svg
                          className="w-6 h-6 align-middle"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="ml-3 text-lg text-gray-700">
                        Awesome Feature
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="p-2 text-green-500 rounded-full fill-current ">
                        <svg
                          className="w-6 h-6 align-middle"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="ml-3 text-lg text-gray-700">
                        And Another Cool Feature
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="p-2 text-green-500 rounded-full fill-current ">
                        <svg
                          className="w-6 h-6 align-middle"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="ml-3 text-lg text-gray-700">
                        One More Feature
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center block p-8 uppercase">
                  <a
                    href="#_"
                    className="block w-full px-6 py-4 mt-3 text-lg font-semibold text-center text-white bg-gray-900 rounded shadow-sm hover:bg-green-600"
                  >
                    Select This Plan
                  </a>
                </div>
              </div>
            </div>
            <div className="relative z-10 w-full max-w-md my-8 bg-white rounded-lg shadow-lg sm:w-2/3 lg:w-1/3 sm:my-5">
              <div className="py-4 text-sm font-semibold leading-none tracking-wide text-center text-white uppercase bg-indigo-500 rounded-t">
                Most Popular
              </div>
              <div className="block max-w-sm px-8 mx-auto mt-5 text-sm text-left text-black sm:text-md lg:px-6">
                <h3 className="p-3 pb-1 text-lg font-bold tracking-wide text-center uppercase">
                  Pro<span className="ml-2 font-light">Plan</span>
                </h3>
                <h4 className="flex items-center justify-center pb-6 text-5xl font-bold text-center text-gray-900">
                  <span className="mr-1 -ml-2 text-lg text-gray-700">$</span>98
                </h4>
                <p className="text-sm text-gray-600">
                  Our most popular package is the Pro Plan which gives you
                  access to the following:
                </p>
              </div>
              <div className="flex justify-start pl-12 mt-8 sm:justify-start">
                <ul>
                  <li className="flex items-center">
                    <div className="p-2 text-green-500 rounded-full fill-current">
                      <svg
                        className="w-6 h-6 align-middle"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="ml-3 text-lg text-gray-700">
                      Really Cool Features
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="p-2 text-green-500 rounded-full fill-current ">
                      <svg
                        className="w-6 h-6 align-middle"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="ml-3 text-lg text-gray-700">
                      Another Cool Feature
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="p-2 text-green-500 rounded-full fill-current ">
                      <svg
                        className="w-6 h-6 align-middle"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="ml-3 text-lg text-gray-700">
                      And One More
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center block p-8 uppercase">
                <a
                  href="#_"
                  className="block w-full px-6 py-4 mt-3 text-lg font-semibold text-center text-white bg-gray-900 rounded shadow-sm hover:bg-indigo-600"
                >
                  Select This Plan
                </a>
              </div>
            </div>
            <div className="relative z-0 w-11/12 max-w-sm my-8 rounded-lg shadow-lg sm:w-3/5 lg:w-1/3 sm:my-5 md:-ml-4">
              <div className="overflow-hidden text-black bg-white rounded-lg shadow-lg shadow-inner">
                <div className="block max-w-sm px-8 mx-auto mt-5 text-sm text-left text-black sm:text-md lg:px-8">
                  <h3 className="p-3 pb-1 text-lg font-bold tracking-wide text-center uppercase">
                    Premium<span className="ml-2 font-light">Plan</span>
                  </h3>
                  <h4 className="flex items-center justify-center pb-6 text-4xl font-bold text-center text-gray-900">
                    <span className="mr-1 -ml-2 text-lg text-gray-700">$</span>
                    78
                  </h4>
                  <p className="pl-2 text-sm text-gray-600">
                    With our premium plan you can take advantage of all the
                    following features:
                  </p>
                </div>
                <div className="flex flex-wrap px-8 mt-8">
                  <ul>
                    <li className="flex items-center">
                      <div className="p-2 text-green-500 rounded-full fill-current ">
                        <svg
                          className="w-6 h-6 align-middle"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="ml-3 text-lg text-gray-700">
                        Totally Tubular Feature
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="p-2 text-green-500 rounded-full fill-current ">
                        <svg
                          className="w-6 h-6 align-middle"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="ml-3 text-lg text-gray-700">
                        Super Cool Feature
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="p-2 text-green-500 rounded-full fill-current ">
                        <svg
                          className="w-6 h-6 align-middle"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="ml-3 text-lg text-gray-700">
                        And One More
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center block p-8 uppercase">
                  <a
                    href="#_"
                    className="block w-full px-6 py-4 mt-3 text-lg font-semibold text-center text-white bg-gray-900 rounded shadow-sm hover:bg-green-600"
                  >
                    Select This Plan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
