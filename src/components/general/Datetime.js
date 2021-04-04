import React, { useEffect, useState } from "react";
import usePlatformTz from "./chat/hooks/usePlatformTz";
// import * as OutlineIcons from "../../assets/icons/outline";
function padNumber(number, length = 2, str = "0") {
  return number.toString().padStart(length, str);
}
/**
 *
 * @param {*} param0
 * @returns Returns the date in a UTC format to keep track of the timezone.
 */
export default function Datetime({ value, onChange, label, className, name, timezone, ...attrs }) {
  const [state, setState] = useState({ date: "", time: "" });
  const [moment] = usePlatformTz();
  useEffect(() => {
    if (value) {
      let valueDate = {};

      if (moment(value)?.isValid()) {
        valueDate = moment(value);
      } else if (moment(value)?.isValid()) {
        valueDate = moment(value);
      }

      if (valueDate?.isValid && valueDate.isValid()) {
        setState({
          date: valueDate.format("yyyy-MM-DD"),
          time: `${padNumber(valueDate.get("hours"))}:${padNumber(valueDate.get("minutes"))}`
        });
      }
    }
    /*eslint-disable-next-line */
  }, [timezone]);

  const onUpdate = event => {
    const { value, type } = event.target;
    let date = moment(state.date);
    let time = date;

    if (/date/i.test(type)) {
      date = moment(value);
      setState(prevState => ({
        ...prevState,
        date: date.format("yyyy-MM-DD")
      }));
    } else {
      time = moment(value, "HH:mm");
      setState(prevState => ({
        ...prevState,
        time: `${padNumber(time.get("hours"))}:${padNumber(time.get("minutes"))}`
      }));
    }
    if (date.isValid()) {
      date.set({
        hour: time.get("hours"),
        minute: time.get("minutes")
      });
      onChange({
        target: {
          name,
          value: date.toString()
        }
      });
    }
  };

  // const clear = () => {
  //   setState({
  //     date: "",
  //     time: ""
  //   });
  //   onChange({ target: { name, value: null } });
  // };

  return (
    <div className="flex-col items-center">
      <div
        className={
          className +
          " bg-white inline-block mr-3 px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        }
      >
        {label && (
          <label for={name}>
            <b>{label}</b>
          </label>
        )}

        <input
          type="date"
          value={state.date}
          onChange={onUpdate}
          name={name}
          {...attrs}
          className="focus:outline-none"
        />
      </div>
      <div
        className={
          className +
          " bg-white inline-block  px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        }
      >
        <div id="dateTime" className="inline-flex items-center">
          <input
            onChange={onUpdate}
            type="time"
            value={state.time}
            {...attrs}
            className="  appearance-none outline-none border-none"
            pattern="[0-9]{2}:[0-9]{2}"
          />
          {/*<OutlineIcons.XCircle*/}
          {/*  onClick={clear}*/}
          {/*  className="text-gray-600 cursor-pointer h-6 w-1/6 inline"*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
}
