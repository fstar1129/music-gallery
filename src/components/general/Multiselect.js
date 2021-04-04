import React, { useEffect, useRef, useState } from "react";
import * as OutlineIcons from "../../assets/icons/outline";
import useClickOutside from "./chat/hooks/useClickOutside";
export default function Multiselect({ onChange, options, value, name, ...attrs }) {
  const [state, setState] = useState({
    show: false,
    options: {}
  });

  const thisEl = useRef();

  const open = () => {
    setState(prevState => ({
      ...prevState,
      show: true
    }));
  };
  const close = () => {
    setState(prevState => ({
      ...prevState,
      show: false
    }));
  };
  useClickOutside(thisEl, close);
  useEffect(() => {
    const newOptions = Object.fromEntries(options.map(e => [e.id, e]));
    setState(prevState => ({
      ...prevState,
      options: newOptions
    }));
  }, [options]);
  const select = option => {
    const values = new Set([...value]);
    if (values.has(option.id)) {
      values.delete(option.id);
    } else {
      values.add(option.id);
    }
    onChange({
      target: { name, value: Array.from(values) }
    });
  };
  const remove = index => {
    onChange({
      target: { name, value: [...value.slice(0, index), ...value.slice(index + 1)] }
    });
  };

  return (
    <div className="inline-block" ref={thisEl}>
      <input type="hidden" value={value} {...attrs} />
      <div className="inline-block relative w-80">
        <div className="flex flex-col items-center relative">
          <div click="open" className="w-full">
            <div className="my-2 p-1 flex border border-gray-200 bg-white rounded">
              <div className="flex flex-auto flex-wrap" onClick={open}>
                {(value || []).map((option, index) => (
                  <div
                    key={option}
                    className="flex justify-center items-center m-1 font-medium py-1 px-1 bg-white rounded bg-gray-100 border"
                  >
                    <div className="text-xs font-normal leading-none max-w-full flex-initial">
                      {(state.options && state.options[option]?.name) ||
                        state.options[option]?.text ||
                        state.options[option]?.displayName}
                    </div>
                    <div className="flex flex-auto flex-row-reverse">
                      <div onClick={() => remove(index)}>
                        <svg className="fill-current h-4 w-4 text-red-700 " role="button" viewBox="0 0 20 20">
                          <path
                            d="M14.348,14.849c-0.469,0.469-1.229,0.469-1.697,0L10,11.819l-2.651,3.029c-0.469,0.469-1.229,0.469-1.697,0
                                           c-0.469-0.469-0.469-1.229,0-1.697l2.758-3.15L5.651,6.849c-0.469-0.469-0.469-1.228,0-1.697s1.228-0.469,1.697,0L10,8.183
                                           l2.651-3.031c0.469-0.469,1.228-0.469,1.697,0s0.469,1.229,0,1.697l-2.758,3.152l2.758,3.15
                                           C14.817,13.62,14.817,14.38,14.348,14.849z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex-1">
                  {!(value || []).length && (
                    <input
                      {...attrs}
                      placeholder="Select options"
                      className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                      value={value}
                      onChange={() => null}
                      name={name}
                    />
                  )}
                </div>
              </div>
              <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                {!state.show ? (
                  <button
                    type="button"
                    onClick={open}
                    className="cursor-pointer open w-6 h-6 text-gray-600 outline-none focus:outline-none"
                  >
                    <svg version="1.1" className="fill-current h-4 w-4 " viewBox="0 0 20 20">
                      <path
                        d="M17.418,6.109c0.272-0.268,0.709-0.268,0.979,0s0.271,0.701,0,0.969l-7.908,7.83
	c-0.27,0.268-0.707,0.268-0.979,0l-7.908-7.83c-0.27-0.268-0.27-0.701,0-0.969c0.271-0.268,0.709-0.268,0.979,0L10,13.25
	L17.418,6.109z"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={close}
                    className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                  >
                    <svg className="fill-current h-4 w-4 " viewBox="0 0 20 20">
                      <path
                        d="M2.582,13.891c-0.272,0.268-0.709,0.268-0.979,0s-0.271-0.701,0-0.969l7.908-7.83
	c0.27-0.268,0.707-0.268,0.979,0l7.908,7.83c0.27,0.268,0.27,0.701,0,0.969c-0.271,0.268-0.709,0.268-0.978,0L10,6.75L2.582,13.891z
	"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-full px-4">
            {state.show && (
              <div className="absolute shadow top-100 bg-white z-40 w-full left-0 rounded max-h-select z-100 ">
                <div className="flex flex-col w-full overflow-y-auto max-h-48 overflow-auto">
                  {Object.values(state.options || []).map(option => {
                    return (
                      <div
                        className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-gray-100 "
                        onClick={e => select(option)}
                        key={option.id}
                      >
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative">
                          <div className="w-full items-center flex justify-between">
                            <div className="mx-2 leading-6">
                              {option.text || option.name || option.displayName || ""}
                            </div>
                            {(value || []).includes(option.id) && (
                              <OutlineIcons.Check className="h-8 w-8 text-green-600 " />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
