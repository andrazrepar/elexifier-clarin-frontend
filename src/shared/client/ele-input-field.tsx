import { EleFormErrors } from "./ele-form-errors";

export interface EleInputFieldProps {
	label?: string;
	name: string;
	value?: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
	existingValue?: string;
	handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	errors?: string[] | null;
}

export function EleInputField({
	label,
	name,
	value,
	type,
	placeholder,
	required,
	handleChange,
	className,
	existingValue,
	errors,
	...props
}: EleInputFieldProps) {
	return (
		<div className={`flex items-center mt-2 mb-2 ${className}`}>
			{label && <label className="text-xs text-gray-600 mr-2">{label}:</label>}
			<input
				type={type ? type : "text"}
				name={name}
				value={value}
				placeholder={placeholder}
				required={required}
				defaultValue={existingValue}
				onChange={handleChange ? handleChange : undefined}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				onClick={(e) => e.stopPropagation()}
			/>
			<EleFormErrors errors={errors} />
		</div>
	);
}
