import React, { useState } from "react";

export const EleCheckbox: React.FC<any> = ({
	id,
	label,
	className = "text-sm font-medium text-indigo-600",
	isChecked: initialIsChecked,
	...props
}) => {
	const [isChecked, setIsChecked] = useState(initialIsChecked);

	const handleOnChange = () => {
		setIsChecked(!isChecked);
	};
	return (
		<div className={`${className} flex justify-between items-center mt-2 mb-2`}>
			<label className="text-sm text-gray-600 mr-2">{label}:</label>
			<div className="flex justify-center items-center flex-grow">
				<input
					type="checkbox"
					id={id}
					name={id}
					checked={isChecked}
					onChange={handleOnChange}
					className="h-5 w-5 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
				/>
			</div>
		</div>
	);
};
