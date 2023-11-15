import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";

import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { FiCalendar } from "react-icons/fi";

import "react-datepicker/dist/react-datepicker.css";
import "./chakra-react-datepicker.css";

const customDateInput = ({ value, onClick, onChange }, ref) => (
  <Input
    autoComplete="off"
    background="#1D202B"
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
  />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

const icon = <FiCalendar />;

const DatePicker = ({ selectedDate, onChange, ...props }) => {
  return (
    <>
      <InputGroup className="dark-theme">
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          className="react-datapicker__input-text"
          customInput={<CustomInput />}
          dateFormat="dd/MM/yyyy"
          {...props}
        />
        <InputRightElement color="gray.500" children={icon} />
      </InputGroup>
    </>
  );
};

export default DatePicker;