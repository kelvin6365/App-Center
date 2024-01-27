import React from 'react';

const Features = () => {
  return (
    <div
      id="features"
      className="relative w-full px-8 py-10 border-t border-gray-200 md:py-16 lg:py-24 xl:py-40 xl:px-0"
    >
      <div className="container flex flex-col items-center justify-between h-full max-w-6xl mx-auto">
        <h2 className="my-5 text-base font-medium tracking-tight text-indigo-500 uppercase">
          Our Features
        </h2>
        <h3 className="max-w-2xl px-5 mt-2 text-3xl font-black leading-tight text-center text-gray-900 sm:mt-0 sm:px-0 sm:text-6xl">
          Everything You Need to Manage Your Apps
        </h3>
        <div className="flex flex-col w-full mt-0 lg:flex-row sm:mt-10 lg:mt-20">
          <div className="w-full max-w-md p-4 mx-auto mb-0 sm:mb-16 lg:mb-0 lg:w-1/3">
            <div className="relative flex flex-col items-center justify-center w-full h-full p-20 mr-5 rounded-lg">
              <svg
                className="absolute w-full h-full text-gray-100 fill-current"
                viewBox="0 0 377 340"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <g>
                    <path d="M342.8 3.7c24.7 14 18.1 75 22.1 124s18.6 85.8 8.7 114.2c-9.9 28.4-44.4 48.3-76.4 62.4-32 14.1-61.6 22.4-95.9 28.9-34.3 6.5-73.3 11.1-95.5-6.2-22.2-17.2-27.6-56.5-47.2-96C38.9 191.4 5 151.5.9 108.2-3.1 64.8 22.7 18 61.8 8.7c39.2-9.2 91.7 19 146 16.6 54.2-2.4 110.3-35.6 135-21.6z" />
                  </g>
                </g>
              </svg>
              <svg
                className="relative w-20 h-20"
                viewBox="0 0 58 58"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <linearGradient
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                    id="linearGradient-1TriangleIcon1"
                  >
                    <stop stopColor="#9C09DB" offset="0%" />
                    <stop stopColor="#1C0FD7" offset="100%" />
                  </linearGradient>
                  <filter
                    x="-14%"
                    y="-10%"
                    width="128%"
                    height="128%"
                    filterUnits="objectBoundingBox"
                    id="filter-3TriangleIcon1"
                  >
                    <feOffset
                      dy="2"
                      in="SourceAlpha"
                      result="shadowOffsetOuter1"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      in="shadowOffsetOuter1"
                      result="shadowBlurOuter1"
                    />
                    <feColorMatrix
                      values="0 0 0 0 0.141176471 0 0 0 0 0.031372549 0 0 0 0 0.501960784 0 0 0 0.15 0"
                      in="shadowBlurOuter1"
                    />
                  </filter>
                  <path
                    d="M17.947 0h14.106c6.24 0 8.503.65 10.785 1.87a12.721 12.721 0 015.292 5.292C49.35 9.444 50 11.707 50 17.947v14.106c0 6.24-.65 8.503-1.87 10.785a12.721 12.721 0 01-5.292 5.292C40.556 49.35 38.293 50 32.053 50H17.947c-6.24 0-8.503-.65-10.785-1.87a12.721 12.721 0 01-5.292-5.292C.65 40.556 0 38.293 0 32.053V17.947c0-6.24.65-8.503 1.87-10.785A12.721 12.721 0 017.162 1.87C9.444.65 11.707 0 17.947 0z"
                    id="path-2TriangleIcon1"
                  />
                </defs>
                <g
                  id="Page-1TriangleIcon1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Desktop-HDTriangleIcon1"
                    transform="translate(-291 -1278)"
                  >
                    <g
                      id="FeaturesTriangleIcon1"
                      transform="translate(170 915)"
                    >
                      <g id="Group-9TriangleIcon1" transform="translate(0 365)">
                        <g id="Group-8TriangleIcon1" transform="translate(125)">
                          <g id="Rectangle-9TriangleIcon1">
                            <use
                              fill="#000"
                              filter="url(#filter-3TriangleIcon1)"
                              xlinkHref="#path-2TriangleIcon1"
                            />
                            <use
                              fill="url(#linearGradient-1TriangleIcon1)"
                              xlinkHref="#path-2TriangleIcon1"
                            />
                          </g>
                          <g
                            id="playTriangleIcon1"
                            transform="translate(18 15)"
                            fill="#FFF"
                            fillRule="nonzero"
                          >
                            <path
                              d="M9.432 2.023l8.919 14.879a1.05 1.05 0 01-.384 1.452 1.097 1.097 0 01-.548.146H-.42A1.07 1.07 0 01-1.5 17.44c0-.19.052-.375.15-.538L7.567 2.023a1.092 1.092 0 011.864 0z"
                              id="TriangleIcon1"
                              transform="rotate(90 8.5 10)"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <h4 className="relative mt-6 text-lg font-bold">
                Automated Tools
              </h4>
              <p className="relative mt-2 text-base text-center text-gray-600">
                Automate your workflow with these top of the line marketing
                tools.
              </p>
              <a
                href="#_"
                className="relative flex mt-2 text-sm font-medium text-indigo-500 underline"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="w-full max-w-md p-4 mx-auto mb-0 sm:mb-16 lg:mb-0 lg:w-1/3">
            <div className="relative flex flex-col items-center justify-center w-full h-full p-20 mr-5 rounded-lg">
              <svg
                className="absolute w-full h-full text-gray-100 fill-current"
                viewBox="0 0 358 372"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <g>
                    <path d="M315.7 6.5c30.2 15.1 42.6 61.8 41.5 102.5-1.1 40.6-15.7 75.2-24.3 114.8-8.7 39.7-11.3 84.3-34.3 107.2-23 22.9-66.3 23.9-114.5 30.7-48.2 6.7-101.3 19.1-123.2-4.1-21.8-23.2-12.5-82.1-21.6-130.2C30.2 179.3 2.6 141.9.7 102c-2-39.9 21.7-82.2 57.4-95.6 35.7-13.5 83.3 2.1 131.2 1.7 47.9-.4 96.1-16.8 126.4-1.6z" />
                  </g>
                </g>
              </svg>
              <svg
                className="relative w-20 h-20"
                viewBox="0 0 58 58"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <linearGradient
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                    id="linearGradient-1Icon2"
                  >
                    <stop stopColor="#F2C314" offset="0%" />
                    <stop stopColor="#FC3832" offset="100%" />
                  </linearGradient>
                  <filter
                    x="-14%"
                    y="-10%"
                    width="128%"
                    height="128%"
                    filterUnits="objectBoundingBox"
                    id="filter-3Icon2"
                  >
                    <feOffset
                      dy="2"
                      in="SourceAlpha"
                      result="shadowOffsetOuter1"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      in="shadowOffsetOuter1"
                      result="shadowBlurOuter1"
                    />
                    <feColorMatrix
                      values="0 0 0 0 0.501960784 0 0 0 0 0.125490196 0 0 0 0 0 0 0 0 0.15 0"
                      in="shadowBlurOuter1"
                    />
                  </filter>
                  <path
                    d="M17.947 0h14.106c6.24 0 8.503.65 10.785 1.87a12.721 12.721 0 015.292 5.292C49.35 9.444 50 11.707 50 17.947v14.106c0 6.24-.65 8.503-1.87 10.785a12.721 12.721 0 01-5.292 5.292C40.556 49.35 38.293 50 32.053 50H17.947c-6.24 0-8.503-.65-10.785-1.87a12.721 12.721 0 01-5.292-5.292C.65 40.556 0 38.293 0 32.053V17.947c0-6.24.65-8.503 1.87-10.785A12.721 12.721 0 017.162 1.87C9.444.65 11.707 0 17.947 0z"
                    id="path-2Icon2"
                  />
                </defs>
                <g
                  id="Page-1Icon2"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g id="Desktop-HDIcon2" transform="translate(-691 -1278)">
                    <g id="FeaturesIcon2" transform="translate(170 915)">
                      <g id="Group-9-CopyIcon2" transform="translate(400 365)">
                        <g id="Group-8Icon2" transform="translate(125)">
                          <g id="Rectangle-9Icon2">
                            <use
                              fill="#000"
                              filter="url(#filter-3Icon2)"
                              xlinkHref="#path-2Icon2"
                            />
                            <use
                              fill="url(#linearGradient-1Icon2)"
                              xlinkHref="#path-2Icon2"
                            />
                          </g>
                          <g
                            id="machine-learningIcon2"
                            transform="translate(14 12)"
                            fill="#FFF"
                            fillRule="nonzero"
                          >
                            <path
                              d="M10.554 21.418v-2.68c-1.1-.204-1.932-1.143-1.932-2.271 0-.468.143-.903.388-1.267l-2.32-1.662L4.367 15.2a2.254 2.254 0 01-.005 2.541l5.28 4.05c.268-.182.577-.311.911-.373zm.892 0c.334.062.643.191.912.373l5.28-4.05a2.254 2.254 0 01-.006-2.54l-2.321-1.663L12.99 15.2c.245.364.388.8.388 1.267 0 1.128-.832 2.067-1.932 2.27v2.681zm1.538.997c.25.365.394.803.394 1.274C13.378 24.965 12.314 26 11 26s-2.378-1.035-2.378-2.311c0-.471.145-.91.394-1.274l-5.28-4.05c-.385.26-.853.413-1.358.413C1.065 18.778 0 17.743 0 16.467c0-1.129.832-2.068 1.932-2.27v-2.393C.832 11.6 0 10.662 0 9.534c0-1.277 1.065-2.312 2.378-2.312.505 0 .973.153 1.358.414l5.28-4.05a2.254 2.254 0 01-.394-1.275C8.622 1.035 9.686 0 11 0s2.378 1.035 2.378 2.311c0 .471-.145.91-.394 1.274l5.28 4.05c.385-.26.853-.413 1.358-.413C20.935 7.222 22 8.257 22 9.533c0 1.129-.832 2.068-1.932 2.27v2.393c1.1.203 1.932 1.142 1.932 2.27 0 1.277-1.065 2.312-2.378 2.312-.505 0-.973-.153-1.358-.414l-5.28 4.05zm-9.243-7.843L5.937 13l-2.196-1.572c-.27.183-.58.314-.917.376v2.392c.336.062.647.193.917.376zm.627-3.772l2.321 1.662L9.01 10.8a2.254 2.254 0 01-.388-1.267c0-1.128.832-2.067 1.932-2.27V4.582a2.403 2.403 0 01-.912-.373l-5.28 4.05a2.254 2.254 0 01.006 2.54zm13.89 3.772c.27-.183.582-.314.918-.376v-2.392a2.403 2.403 0 01-.917-.376L16.063 13l2.196 1.572zm-.62-6.313l-5.28-4.05a2.403 2.403 0 01-.912.373v2.68c1.1.204 1.932 1.143 1.932 2.271 0 .468-.143.903-.388 1.267l2.32 1.662 2.322-1.662a2.254 2.254 0 01.005-2.541zm-8 6.313A2.415 2.415 0 0111 14.156c.507 0 .977.154 1.363.416L14.559 13l-2.196-1.572a2.415 2.415 0 01-1.363.416c-.507 0-.977-.154-1.363-.416L7.441 13l2.196 1.572zM11 10.978c.821 0 1.486-.647 1.486-1.445 0-.797-.665-1.444-1.486-1.444s-1.486.647-1.486 1.444c0 .798.665 1.445 1.486 1.445zm0 6.933c.821 0 1.486-.647 1.486-1.444 0-.798-.665-1.445-1.486-1.445s-1.486.647-1.486 1.445c0 .797.665 1.444 1.486 1.444zm8.622-6.933c.82 0 1.486-.647 1.486-1.445 0-.797-.665-1.444-1.486-1.444s-1.487.647-1.487 1.444c0 .798.666 1.445 1.487 1.445zm0 6.933c.82 0 1.486-.647 1.486-1.444 0-.798-.665-1.445-1.486-1.445s-1.487.647-1.487 1.445c0 .797.666 1.444 1.487 1.444zM2.378 10.978c.821 0 1.487-.647 1.487-1.445 0-.797-.666-1.444-1.487-1.444-.82 0-1.486.647-1.486 1.444 0 .798.665 1.445 1.486 1.445zm0 6.933c.821 0 1.487-.647 1.487-1.444 0-.798-.666-1.445-1.487-1.445-.82 0-1.486.647-1.486 1.445 0 .797.665 1.444 1.486 1.444zM11 25.133c.821 0 1.486-.646 1.486-1.444 0-.798-.665-1.445-1.486-1.445s-1.486.647-1.486 1.445.665 1.444 1.486 1.444zm0-21.377c.821 0 1.486-.647 1.486-1.445S11.821.867 11 .867s-1.486.646-1.486 1.444c0 .798.665 1.445 1.486 1.445z"
                              id="ShapeIcon2"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <h4 className="relative mt-6 text-lg font-bold">
                Version Control
              </h4>
              <p className="relative mt-2 text-base text-center text-gray-600">
                Manage releases and track build history.
              </p>
              <a
                href="#_"
                className="relative flex mt-2 text-sm font-medium text-indigo-500 underline"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="w-full max-w-md p-4 mx-auto mb-16 lg:mb-0 lg:w-1/3">
            <div className="relative flex flex-col items-center justify-center w-full h-full p-20 mr-5 rounded-lg">
              <svg
                className="absolute w-full h-full text-gray-100 fill-current"
                viewBox="0 0 378 410"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <g>
                    <path d="M305.9 14.4c23.8 24.6 16.3 84.9 26.6 135.1 10.4 50.2 38.6 90.3 43.7 137.8 5.1 47.5-12.8 102.4-50.7 117.4-37.9 15.1-95.7-9.8-151.7-12.2-56.1-2.5-110.3 17.6-130-3.4-19.7-20.9-4.7-82.9-11.5-131.2C25.5 209.5-3 174.7 1.2 147c4.2-27.7 41-48.3 75-69.6C110.1 56.1 141 34.1 184 17.5c43.1-16.6 98.1-27.7 121.9-3.1z" />
                  </g>
                </g>
              </svg>
              <svg
                className="relative w-20 h-20"
                viewBox="0 0 58 58"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <linearGradient
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                    id="linearGradient-1Icon3"
                  >
                    <stop stopColor="#32FBFC" offset="0%" />
                    <stop stopColor="#3214F2" offset="100%" />
                  </linearGradient>
                  <filter
                    x="-14%"
                    y="-10%"
                    width="128%"
                    height="128%"
                    filterUnits="objectBoundingBox"
                    id="filter-3Icon3"
                  >
                    <feOffset
                      dy="2"
                      in="SourceAlpha"
                      result="shadowOffsetOuter1"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      in="shadowOffsetOuter1"
                      result="shadowBlurOuter1"
                    />
                    <feColorMatrix
                      values="0 0 0 0 0.031372549 0 0 0 0 0.149019608 0 0 0 0 0.658823529 0 0 0 0.15 0"
                      in="shadowBlurOuter1"
                    />
                  </filter>
                  <path
                    d="M17.947 0h14.106c6.24 0 8.503.65 10.785 1.87a12.721 12.721 0 015.292 5.292C49.35 9.444 50 11.707 50 17.947v14.106c0 6.24-.65 8.503-1.87 10.785a12.721 12.721 0 01-5.292 5.292C40.556 49.35 38.293 50 32.053 50H17.947c-6.24 0-8.503-.65-10.785-1.87a12.721 12.721 0 01-5.292-5.292C.65 40.556 0 38.293 0 32.053V17.947c0-6.24.65-8.503 1.87-10.785A12.721 12.721 0 017.162 1.87C9.444.65 11.707 0 17.947 0z"
                    id="path-2Icon3"
                  />
                </defs>
                <g
                  id="Page-1Icon3"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g id="Desktop-HDIcon3" transform="translate(-1091 -1278)">
                    <g id="FeaturesIcon3" transform="translate(170 915)">
                      <g
                        id="Group-9-Copy-2Icon3"
                        transform="translate(800 365)"
                      >
                        <g id="Group-8Icon3" transform="translate(125)">
                          <g id="Rectangle-9Icon3">
                            <use
                              fill="#000"
                              filter="url(#filter-3Icon3)"
                              xlinkHref="#path-2Icon3"
                            />
                            <use
                              fill="url(#linearGradient-1Icon3)"
                              xlinkHref="#path-2Icon3"
                            />
                          </g>
                          <g
                            id="smart-notificationsIcon3"
                            transform="translate(15 11)"
                            fill="#FFF"
                            fillRule="nonzero"
                          >
                            <path
                              d="M12.519 3.243a6.808 6.808 0 00-.187 1.298h-8.44a2.595 2.595 0 00-2.595 2.594v12.973a2.595 2.595 0 002.595 2.595h12.973a2.595 2.595 0 002.594-2.595v-8.44c.445-.02.88-.084 1.298-.187v8.627A3.892 3.892 0 0116.865 24H3.892A3.892 3.892 0 010 20.108V7.135a3.892 3.892 0 013.892-3.892h8.627zm6.616 6.487a4.865 4.865 0 110-9.73 4.865 4.865 0 010 9.73z"
                              id="IconIcon3"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <h4 className="relative mt-6 text-lg font-bold">
                Smart Notifications
              </h4>
              <p className="relative mt-2 text-base text-center text-gray-600">
                Our smart notifications will notify you when users convert.
              </p>
              <a
                href="#_"
                className="relative flex mt-2 text-sm font-medium text-indigo-500 underline"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
