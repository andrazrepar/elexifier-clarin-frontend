import React, { useState } from "react";
import { EleInputField } from "./ele-input-field";

type SelectAttributes = React.SelectHTMLAttributes<HTMLSelectElement>;

interface Option {
	name: string;
	value: string;
}

interface EleDropdownFieldProps extends SelectAttributes {
	label?: string;
	name?: string;
	options: Option[];
	defaultValue?: string;
	displayValue?: string;
	showCustom?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function EleDropdownField({
	label,
	name,
	options,
	defaultValue,
	displayValue = "key",
	showCustom = true,
	onChange,
	...props
}: EleDropdownFieldProps) {
	const [customValue, setCustomValue] = useState("");
	const [isCustom, setIsCustom] = useState(false);
	const [isConstant, setIsConstant] = useState(false);
	const [constantValue, setConstantValue] = useState("");

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setIsCustom(event.target.value === "custom");
		setIsConstant(event.target.value === options.constant);
		if (onChange) {
			onChange(event);
		}
	};

	//console.log("def", defaultValue);

	return (
		<div className="flex items-center mt-2 mb-2">
			{label && <label className="text-sm text-gray-600 mr-2">{label}:</label>}
			<select
				defaultValue={defaultValue}
				name={`${name}`}
				onChange={handleChange}
				onClick={(e) => e.stopPropagation()}
				className="flex-grow py-2 px-3 rounded-md border-2 text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				{...props}
			>
				{options.map(({ name, value }) => (
					<option key={name} value={value}>
						{displayValue === "value" ? value : name}
					</option>
				))}
				{showCustom && <option value="custom">Custom...</option>}
			</select>
			{isCustom && (
				<EleInputField
					value={customValue}
					name={`${name}-custom`}
					handleChange={(e) => setCustomValue(e.target.value)}
					className="ml-2"
				/>
			)}
			{isConstant && (
				<EleInputField
					value={constantValue}
					name={`${name}-constant`}
					handleChange={(e) => setConstantValue(e.target.value)}
					className="ml-2"
				/>
			)}
		</div>
	);
}
