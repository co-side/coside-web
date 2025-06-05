import { useId } from "react";
import type { OverridableStringUnion } from "@mui/types";
import type { InputBasePropsColorOverrides } from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from '@mui/material/FormHelperText';
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select";

interface OptionType<Value extends string = string> {
  label: string
  value: Value;
}

interface SelectProps<Value extends string = string, Option extends OptionType<Value> = OptionType<Value>> {
  fullWidth?: boolean;
  label?: string;
  name?: string;
  value?: Value;
  options?: Option[];
  color?: OverridableStringUnion<
    "primary" | "secondary" | "error" | "info" | "success" | "warning",
    InputBasePropsColorOverrides
  >;
  error?: boolean;
  helperText?: string;
  onChange?: (event: SelectChangeEvent<Value>) => void;
}

function Select<Value extends string, Option extends OptionType<Value>>({
  fullWidth,
  label,
  name,
  value,
  options,
  color,
  error,
  helperText,
  onChange,
}: SelectProps<Value, Option>) {
  const id = useId();
  const labelId = `${id}-label-id`;

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel id={labelId} color="secondary">{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        name={name}
        color={color}
        label={label}
        onChange={onChange}
        value={value as any}
      >
        {Array.isArray(options) &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default Select;
