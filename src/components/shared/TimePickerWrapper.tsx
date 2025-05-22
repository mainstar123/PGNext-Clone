import { FC } from "react";
// import TimePicker from "react-time-picker";
import { TimePickerValue } from "react-time-picker";
import TimePicker from "react-time-picker/dist/entry.nostyle";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface TimePickerWrapperProps {
  value: any;
  onChange: (value: TimePickerValue) => void;
  format: "h:mm:ss" | "mm:ss" | "hh:mm:ss" | "H:mm:ss" | "HH:mm:ss";
}

const TimePickerWrapper: FC<TimePickerWrapperProps> = ({
  value,
  onChange,
  format,
}) => {
  return (
    <div className="py-2">
      <TimePicker
        className="report-time-adjustment"
        onChange={onChange}
        value={value}
        maxDetail="second"
        format={format}
        disableClock
        clearIcon={null}
      />
    </div>
  );
};

export default TimePickerWrapper;
