import React, { useEffect, useRef, useState } from "react";
//import { debounce } from "lodash";
import { fromEvent } from "rxjs";
import { map, distinctUntilChanged, tap, throttleTime, filter, takeUntil } from "rxjs/operators";
export default function SmartSelect({ value, onChange, label, className, items, name, ...attrs }) {
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(items || []);
  const searchInput = useRef();
  const handleSelect = option => {
    setSearch("");
    onChange({
      target: {
        name,
        value: option
      }
    });
    setTimeout(() => {
      setOpen(false);
    }, 0);
  };
  useEffect(() => {
    const filterOptions = filter => {
      if (filter) {
        setSearch(filter);
        const newItems = items.filter(e => {
          return e.toLowerCase().includes(filter);
        });
        if (newItems.length) {
          setOptions(newItems);
        }
      } else if (!filter) {
        setOptions(items);
        setSearch("");
      }
    };
    if (searchInput.current && isOpen) {
      const filteredValues$ = fromEvent(searchInput.current, "input").pipe(
        throttleTime(250),
        distinctUntilChanged(),
        takeUntil(
          fromEvent(document, "keydown").pipe(
            filter(event => event.keyCode === 9 || event.keyCode === 27),
            tap(() => setOpen(!isOpen))
          )
        ),
        map(event => event.target.value),
        tap(value => filterOptions(value))
      );
      filteredValues$.subscribe(console.log);
      return () => {
        setSearch("");
        if (filteredValues$.unsubscribe) {
          filteredValues$.unsubscribe();
        }
      };
    }
  }, [isOpen, items]);
  const handleOpen = () => {
    setOpen(!isOpen);
    setTimeout(() => {
      if (searchInput.current) {
        searchInput.current.focus();
      }
    }, 0);
  };
  const getHighlightedText = (text, highlight = search) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return highlight ? (
      <span className="font-normal  truncate">
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            className={part.toLowerCase() === highlight.toLowerCase() ? "bg-gray-200" : ""}
          >
            {part}
          </span>
        ))}{" "}
      </span>
    ) : (
      <span className="font-normal truncate">{text}</span>
    );
  };
  return (
    <div className="mt-1 relative">
      <div className="flex">
        <button
          onClick={handleOpen}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={`${className} bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        >
          {isOpen ? (
            <input
              className="appearance-none outline-none"
              type="text"
              name="search"
              ref={searchInput}
            />
          ) : (
            <span className="block truncate">{value}</span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>
      <div
        className={`${isOpen ? "" : "hidden"} absolute mt-1 w-full rounded-md bg-white shadow-lg`}
      >
        <ul
          tabIndex="1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-item-3"
          className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
          {(options || []).map((e, i) => (
            <li
              onClick={() => handleSelect(e)}
              key={e + i}
              id="listbox-option-0"
              role="option"
              aria-selected={e === value ? "true" : "false"}
              className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
            >
              {getHighlightedText(e)}
              {new RegExp(value, "i").test(e) && (
                <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
