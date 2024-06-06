import { useId } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select";

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    fullWidth?: boolean;
    label?: string;
    value?: string;
    options?: Option[];
    onChange?: (event: SelectChangeEvent) => void;
}

export default function Select({
    fullWidth,
    label,
    value,
    options,
    onChange,
}: SelectProps) {
    const id = useId();
    const labelId = `${id}-label-id`;

    return (
        <FormControl fullWidth={fullWidth}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <MuiSelect
                labelId={labelId}
                value={value}
                label={label}
                onChange={onChange}
            >
                {Array.isArray(options) && options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    );
}