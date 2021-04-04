import * as moment from "moment";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function () {
  const { platformData } = useSelector(state => state.frontend);
  useEffect(() => {
    moment.tz.setDefault(platformData.timezone);
  }, [platformData.timezone]);
  return [moment, platformData.timezone];
}
