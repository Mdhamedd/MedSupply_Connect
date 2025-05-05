import React from "react";

function Cart() {
  return (
    <div className="h-[300px] w-[250px] bg-gray-100 z-10 rounded-md border shadow-sm absolute mx-10 left-10 top-12 p-5 overflow-auto">
      <div className="mt-4 space-y-6">
        <ul className="space-y-4">
          <li className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=830&q=80"
              alt=""
              className="size-16 rounded-sm object-cover"
            />

            <div className="flex-1">
              <h3 className="text-sm text-gray-900">Basic Tee 6-Pack</h3>

              <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                <div>
                  <dt className="inline">Size:</dt>{" "}
                  <dd className="inline">XXS</dd>
                </div>

                <div>
                  <dt className="inline">Color:</dt>{" "}
                  <dd className="inline">White</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col items-end gap-2">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="h-8 w-12 rounded-sm border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 focus:outline-none"
              />

              <button className="text-gray-600 transition hover:text-red-600">
                <span className="sr-only">Remove item</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21
                     c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 
                     2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 
                     01-2.244-2.077L4.772 5.79m14.456 
                     0a48.108 48.108 0 00-3.478-.397m-12 
                     .562c.34-.059.68-.114 1.022-.165m0 
                     0a48.11 48.11 0 013.478-.397m7.5 
                     0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
                     51.964 0 00-3.32 0c-1.18.037-2.09 
                     1.022-2.09 2.201v.916m7.5 0a48.667 
                     48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div className="mt-6 space-y-4 text-center">

        <a
          href="#"
          className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
        >
          View my cart (2)
        </a>

        <a
          href="#"
          className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
        >
          Continue shopping
        </a>
      </div>
    </div>
  );
}

export default Cart;
