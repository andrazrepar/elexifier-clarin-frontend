import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { EleInputField } from "./ele-input-field";

export interface EleChildElementProps {
	id: string;
	isSubElementExpanded: object;
	handleExpand: () => void;
	outElement: string;
	value?: string;
	dvalue?: string;
	className?: string;
	children?: React.ReactNode; // Adding children prop to handle child elements
}

function findInSelectorValue(object, id) {
	const idParts = id.split("-"); // Split the ID on hyphens
	const outElementValue = idParts[1]; // Get the value after the first hyphen
	const childrenArray = object.children; // Access the 'children' array

	// If no children, return null
	if (!childrenArray) {
		return null;
	}

	// Iterate over the 'children' array
	for (let i = 0; i < childrenArray.length; i++) {
		// If the 'outElement' value matches the one from the ID
		if (childrenArray[i].outElement === outElementValue) {
			// Return the 'inSelector' value
			return childrenArray[i].inSelector;
		}
		// If the current child has further 'children'
		else if (childrenArray[i].children) {
			// Recursive call
			const result = findInSelectorValue(childrenArray[i], id);

			// If a result was found in the recursive call, return it
			if (result !== null) {
				return result;
			}
		}
	}

	// If no matching 'outElement' value was found, return null
	return null;
}

export const EleChildElement: React.FC<EleChildElementProps> = ({
	id,
	isSubElementExpanded,
	handleExpand,
	outElement,
	value,
	dvalue = "default value",
	children,
	className = "text-sm font-medium text-indigo-600",
}) => {
	const isExpanded = isSubElementExpanded[id];
	console.log("child element value", value, outElement, dvalue, id);

	return (
		<div>
			<div
				className={`cursor-pointer pb-2 flex justify-start items-center ${className}`}
				onClick={() => handleExpand(id)}
			>
				{isExpanded ? (
					<ChevronDownIcon className="h-5 w-5 text-gray-600 mr-2" />
				) : (
					<ChevronDownIcon className="h-5 w-5 text-gray-600 transform rotate-180 mr-2" />
				)}
				<div className="flex items-center">
					<div>{outElement}</div>
				</div>
			</div>

			<div className={`pl-4 mt-2 mb-2 ${isExpanded ? "block" : "hidden"}`}>
				<EleInputField
					label="inSelector"
					name={`${id}-childInSelector`}
					value={value}
				/>
				{children}
			</div>
		</div>
	);
};
