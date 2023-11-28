import React, { useState } from "react";
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
}: EleDropdownFieldProps) {
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		console.log("event", name, event.target.value);
	};

	return (
		<div className="flex items-center mt-2 mb-2">
			{label && <label className="text-sm text-gray-600 mr-2">{label}:</label>}
			<select
				defaultValue={defaultValue}
				key={label}
				name={`${name}`}
				onChange={handleChange}
				onClick={(e) => e.stopPropagation()}
				className="flex-grow py-2 px-3 rounded-md border-2 text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
			>
				{options.map(({ label, value }) => (
					<option key={value} value={value}>
						{value}
					</option>
				))}
			</select>
		</div>
	);
}
