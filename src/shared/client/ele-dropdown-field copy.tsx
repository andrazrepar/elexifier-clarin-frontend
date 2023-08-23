import React, { useState } from "react";
import { EleInputField } from "./ele-input-field";

type SelectAttributes = React.SelectHTMLAttributes<HTMLSelectElement>;

interface EleDropdownFieldProps extends SelectAttributes {
	label?: string;
	name?: string;
	options: { [key: string]: string };
	defaultValue?: string;
	displayValue?: string;
	showCustom?: boolean;
}

export function EleDropdownField({
	label,
	name,
	options,
	defaultValue,
	displayValue = "key",
	showCustom = true,
	...props
}: EleDropdownFieldProps) {
	const [customValue, setCustomValue] = useState("");
	const [isCustom, setIsCustom] = useState(false);
	const [isConstant, setIsConstant] = useState(false);
	const [constantValue, setConstantValue] = useState("");

	const handleChange = (event) => {
		setIsCustom(event.target.value === "custom");
		setIsConstant(event.target.value === options.constant);
	};

	//console.log("def", defaultValue);

	return (
		<div className="flex items-center mt-2 mb-2">
			{label && <label className="text-xs text-gray-600 mr-2">{label}:</label>}
			<select
				defaultValue={defaultValue}
				name={`${name}`}
				onChange={handleChange}
				onClick={(e) => e.stopPropagation()}
				className="flex-grow py-2 px-3 rounded-md border-2 text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				{...props}
			>
				{Object.entries(options).map(([key, value]) => (
					<option key={key} value={value}>
						{displayValue === "value" ? value : key}
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
