import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

interface Option {
	label: string;
	value: string;
}

interface EleDropdownFieldProps {
	label?: string;
	name?: string;
	options: Option[];
	existingValue?: string;
	isClearable?: boolean;
	isSearchable?: boolean;
	onChange?: (selectedOption: React.ChangeEvent<HTMLSelectElement>) => void;
	className?: string;
}

export function EleSearchableDropdownField({
	label,
	name,
	options,
	isClearable = true,
	isSearchable = true,
	onChange,
	existingValue,
	className = "flex items-center mt-2 mb-2",
}: EleDropdownFieldProps) {
	const handleChange = (selectedOption: Option | null) => {
		if (onChange) {
			onChange(selectedOption);
		}
	};

	const findExistingOption = () => {
		return existingValue
			? options.find((option) => option.value === existingValue)
			: undefined;
	};

	return (
		<div className={className}>
			{label && <label className="text-sm text-gray-600 mr-2">{label}:</label>}
			<div onClick={(e) => e.stopPropagation()} className="w-full">
				<Select
					className="basic-single"
					classNamePrefix="select"
					defaultValue={findExistingOption()}
					isDisabled={false}
					isLoading={false}
					isClearable={isClearable}
					isRtl={false}
					isSearchable={isSearchable}
					name={name}
					options={options}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
}
