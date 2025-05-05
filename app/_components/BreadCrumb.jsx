import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-4 transition-transform duration-300 group-hover:scale-110"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-5 transition-transform duration-300 group-hover:scale-110"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const BreadCrumb = ({ path }) => {
  const getProductName = () => {
    if (!path) return "Product";
    const segments = path.split("/");
    return segments[segments.length - 1] || "Product";
  };

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-gray-600">
        <li className="group">
          <Link
            href="/"
            className="flex items-center transition-colors duration-300 
              hover:text-indigo-600 focus:outline-none focus:ring-2 
              focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-1"
            aria-label="Home"
          >
            <HomeIcon />
          </Link>
        </li>

        <li className="group rtl:rotate-180">
          <ChevronIcon />
        </li>

        <li className="group">
          <Link
            href="/categories"
            className="block transition-all duration-300 hover:text-indigo-600 
              hover:scale-105 focus:outline-none focus:ring-2 
              focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-1"
          >
            التصنيفات
          </Link>
        </li>

        <li className="group rtl:rotate-180">
          <ChevronIcon />
        </li>

        <li className="group">
          <span className="block text-gray-400 transition-all duration-300 
            group-hover:text-indigo-600 group-hover:scale-105 rounded-md p-1">
            {getProductName()}
          </span>
        </li>
      </ol>
    </nav>
  );
};

BreadCrumb.propTypes = {
  path: PropTypes.string,
};

BreadCrumb.defaultProps = {
  path: "",
};

export default React.memo(BreadCrumb);
