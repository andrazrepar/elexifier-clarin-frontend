import React, { useState, useEffect } from "react";
import { EleInputField } from "./ele-input-field";

type SelectAttributes = React.SelectHTMLAttributes<HTMLSelectElement>;

interface Option {
	label: string;
	value: string;
}

interface EleDropdownFieldProps extends SelectAttributes {
	label?: string;
	name?: string;
	options: Option[];
	flatTransformation: any;
	displayValue?: string;
	showCustom?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	onConstantChange?: (value: any) => void;
}

export function EleDropdownField({
	label,
	name,
	options,
	flatTransformation,
	displayValue = "key",
	showCustom = true,
	onChange,
	onConstantChange,
	...props
}: EleDropdownFieldProps) {
	const [existingValue, setExistingValue] = useState(() => {
		const initialValue = flatTransformation.hasOwnProperty(`${name}-attribute`)
			? flatTransformation[`${name}-attribute`]
			: "{http://elex.is/wp1/teiLex0Mapper/meta}innerText";

		if (
			initialValue === "{http://elex.is/wp1/teiLex0Mapper/meta}constant" ||
			options.some((item) => item.value === initialValue)
		) {
			return initialValue;
		} else {
			return "custom";
		}
	});
	const [attributeType, setAttributeType] = useState("default");

	useEffect(() => {
		if (existingValue === "{http://elex.is/wp1/teiLex0Mapper/meta}constant") {
			setAttributeType("constant");
		} else if (existingValue === "custom") {
			setAttributeType("custom");
		} else {
			setAttributeType("default");
		}
	}, [existingValue]);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		console.log("handleChange", event.target.value);
		if (event.target.value === "custom") {
			setAttributeType("custom");
		} else if (
			event.target.value === "{http://elex.is/wp1/teiLex0Mapper/meta}constant"
		) {
			setAttributeType("constant");
		} else {
			setAttributeType("default");
		}
	};

	return (
		<div className="flex items-center mt-2 mb-2">
			{label && <label className="text-sm text-gray-600 mr-2">{label}:</label>}
			<select
				defaultValue={existingValue}
				key={label}
				name={`${name}-attribute`}
				onChange={handleChange}
				onClick={(e) => e.stopPropagation()}
				className="flex-grow py-2 px-3 rounded-md border-2 text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				{...props}
			>
				{options.map(({ label, value }) => (
					<option key={value} value={value}>
						{displayValue === "value" ? value : label}
					</option>
				))}
				{showCustom && <option value="custom">Custom...</option>}
			</select>
			{attributeType == "custom" && (
				<EleInputField
					existingValue={
						flatTransformation.hasOwnProperty(`${name}-attribute`) &&
						options.some(
							(item) => item.value === flatTransformation[`${name}-attribute`]
						)
							? ""
							: flatTransformation[`${name}-attribute`]
					}
					name={`${name}-attribute`}
					className="ml-2"
				/>
			)}
			{attributeType == "constant" && (
				<EleInputField
					existingValue={
						flatTransformation.hasOwnProperty(`${name}-constant`)
							? flatTransformation[`${name}-constant`]
							: ""
					}
					name={`${name}-constant`}
					className="ml-2"
				/>
			)}
		</div>
	);
}
