import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface EleInputFieldProps {
	label?: string;
	name: string;
	value?: string;
	handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
}

function EleInputField({
	label,
	name,
	value,
	handleChange,
	className,
}: EleInputFieldProps) {
	return (
		<div className={`flex items-center mt-2 mb-2 ${className}`}>
			{label && <label className="text-xs text-gray-600 mr-2">{label}:</label>}
			<input
				type="text"
				name={name}
				value={value}
				onChange={handleChange ? handleChange : undefined}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
			/>
		</div>
	);
}

interface EleCollapsibleElementProps {
	isExpanded: boolean;
	handleExpand: () => void;
	label: string;
	value?: string;
	className?: string;
}

const EleCollapsibleElement: React.FC<EleCollapsibleElementProps> = ({
	isExpanded,
	handleExpand,
	label,
	value,
	className = "text-sm font-medium text-indigo-600", // default class
}) => (
	<div
		className={`cursor-pointer flex justify-start items-center ${className}`}
		onClick={handleExpand}
	>
		{isExpanded ? (
			<ChevronDownIcon className="h-5 w-5 text-gray-600 mr-2" />
		) : (
			<ChevronDownIcon className="h-5 w-5 text-gray-600 transform rotate-180 mr-2" />
		)}
		<div className="flex items-center">
			<div>{label}</div>
			{value && (
				<div className="ml-4 py-2 px-3 rounded-md text-gray-500">{value}</div>
			)}
		</div>
	</div>
);

type SelectAttributes = React.SelectHTMLAttributes<HTMLSelectElement>;

interface EleDropdownFieldProps extends SelectAttributes {
	label: string;
	path?: string;
	options: { [key: string]: string };
	defaultValue?: string;
}

function EleDropdownField({
	label,
	path,
	options,
	defaultValue,
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

	return (
		<div className="flex items-center mt-2 mb-2">
			<label className="text-xs text-gray-600 mr-2">{label}:</label>
			<select
				defaultValue={defaultValue}
				name={`${path}-attribute`}
				onChange={handleChange}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				{...props}
			>
				{Object.entries(options).map(([key, value]) => (
					<option key={key} value={value}>
						{key}
					</option>
				))}
				<option value="custom">Custom...</option>
			</select>
			{isCustom && (
				<EleInputField
					value={customValue}
					name={`${path}-attribute-custom`}
					handleChange={(e) => setCustomValue(e.target.value)}
					className="ml-2"
				/>
			)}
			{isConstant && (
				<EleInputField
					value={constantValue}
					name={`${path}-attribute-constant`}
					handleChange={(e) => setConstantValue(e.target.value)}
					className="ml-2"
				/>
			)}
		</div>
	);
}

export function TransformTree({
	transformTreeStructure,
	attributeDefaultValues,
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSubElementExpanded, setIsSubElementExpanded] = useState({});
	const [isAdvancedExpanded, setIsAdvancedExpanded] = useState({});

	const advancedFields = ["namespaces", "attribute", "regex", "regexGroup"];

	return (
		<div className="my-2 bg-white ">
			<EleCollapsibleElement
				isExpanded={isExpanded}
				handleExpand={() => setIsExpanded(!isExpanded)}
				label={transformTreeStructure.outElement}
			/>
			{isExpanded && (
				<div className="pl-4 mt-2">
					{transformTreeStructure.textVals?.map((textVal, index) => (
						<div key={index} className="mt-3">
							<EleCollapsibleElement
								isExpanded={isSubElementExpanded[index]}
								handleExpand={() =>
									setIsSubElementExpanded({
										...isSubElementExpanded,
										[index]: !isSubElementExpanded[index],
									})
								}
								label={textVal.outElement}
								value={textVal.value || "Empty"}
							/>
							{isSubElementExpanded[index] && (
								<div className="pl-4 mt-2">
									{Object.keys(textVal)
										.filter(
											(key) =>
												key !== "required" &&
												key !== "outElement" &&
												!advancedFields.includes(key)
										)
										.map((key) => (
											<EleInputField
												key={key}
												name={`${textVal.outElement}-${key}`}
												label={key}
											/>
										))}
									<EleCollapsibleElement
										isExpanded={isAdvancedExpanded[index]}
										handleExpand={() =>
											setIsAdvancedExpanded({
												...isAdvancedExpanded,
												[index]: !isAdvancedExpanded[index],
											})
										}
										label="Advanced"
										className="text-xs font-medium text-gray-800 bg-gray-100 p-1 rounded"
									/>

									{isAdvancedExpanded[index] &&
										advancedFields.map((key) =>
											Object.keys(textVal).includes(key) ? (
												key === "attribute" ? (
													<EleDropdownField
														key={key}
														label={key}
														outElement={textVal.outElement}
														options={attributeDefaultValues}
														defaultValue={
															textVal.outElement === "id"
																? attributeDefaultValues.autogenerated
																: attributeDefaultValues.innerText
														}
													/>
												) : (
													<EleInputField
														key={key}
														name={`${textVal.outElement}-${key}`}
														label={key}
													/>
												)
											) : null
										)}
								</div>
							)}
						</div>
					))}
					{transformTreeStructure.children?.map((child, index) => (
						<TransformTree
							key={index}
							transformTreeStructure={child}
							attributeDefaultValues={attributeDefaultValues}
						/>
					))}
				</div>
			)}
		</div>
	);
}
