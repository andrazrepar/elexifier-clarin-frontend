import { EleInputField } from "../ele-input-field";
import { EleDropdownField } from "../ele-dropdown-field-headword";
import { EleCollapsibleElement } from "../ele-collapsible";
import React, { useState } from "react";
import { attributeDefaultValues } from "../../dmlex-spec";
import { findTMD, findEMDs } from "../find-elements";

export const EleTMD: React.FC<any> = (props) => {
	const parentEMD = findEMDs(props.transformation, props.path);
	const element = findTMD(parentEMD[props.index], props.outElement);

	const [fieldValues, setFieldValues] = useState({
		inSelector: element?.inSelector || "",
		namespaces: element?.namespaces || "",
		attribute:
			element?.attribute || "{http://elex.is/wp1/teiLex0Mapper/meta}innerText",
		regex: element?.regex || "",
		regexGroup: element?.regexGroup || "",
		constant: element?.constant || "",
		outElement: props.outElement || "",
		markers: element?.markers || "",
	});

	const updateValues = (name: string, value: any) => {
		// Create a copy of props.element
		const newElement = [...props.element];
		console.log("new", newElement);
		console.log("old", props.element);

		// If textVals doesn't exist, initialize it as an empty array
		if (!newElement[props.index].textVals) {
			newElement[props.index].textVals = [];
		}

		// Find the object in textVals where outElement matches props.outElement
		let element = newElement[props.index].textVals.find(
			(e: any) => e.outElement === props.outElement
		);

		// If the object doesn't exist, create a new one
		if (!element) {
			element = {
				outElement: props.outElement,
				attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}innerText", // default value, attribute must be set
			};
			newElement[props.index].textVals.push(element);
		}

		// Update the object with the new value
		element[name] = value;

		// Update the element with the new values
		props.updateValues(newElement);
	};

	const handleInputChange = (name: string, value: any) => {
		setFieldValues((prevValues) => ({ ...prevValues, [name]: value }));
		updateValues(name, value);
	};

	const handleConstantChange = (value: any) => {
		setFieldValues((prevValues) => ({ ...prevValues, constant: value }));
		updateValues("constant", value);
	};

	return (
		<EleCollapsibleElement
			id={props.id}
			isExpanded={!!props.isExpanded[props.id]}
			handleExpand={props.handleExpand}
			label={props.outElement}
			className={props.className}
		>
			<EleInputField
				label="Path"
				name={`${props.id}-inSelector`}
				className="text-sm font-medium text-indigo-600"
				existingValue={fieldValues.inSelector}
				handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleInputChange("inSelector", e.target.value)
				}
			/>

			<EleInputField
				label="Namespaces"
				name={`${props.id}-namespaces`}
				className="text-sm font-medium text-indigo-600"
				existingValue={fieldValues.namespaces}
				handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleInputChange("namespaces", e.target.value)
				}
			/>
			<EleDropdownField
				label="Attribute"
				name={`${props.id}-attribute`}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				options={attributeDefaultValues}
				fieldValues={fieldValues}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					handleInputChange("attribute", e.target.value)
				}
				onConstantChange={handleConstantChange}
			/>

			<EleInputField
				label="Regex"
				name={`${props.id}-regex`}
				className="text-sm font-medium text-indigo-600"
				existingValue={fieldValues.regex}
				handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleInputChange("regex", e.target.value)
				}
			/>

			<EleInputField
				label="RegexGroup"
				name={`${props.id}-regexGroup`}
				className="text-sm font-medium text-indigo-600"
				existingValue={fieldValues.regexGroup}
				handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleInputChange("regexGroup", e.target.value)
				}
			/>
		</EleCollapsibleElement>
	);
};
