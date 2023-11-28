import { EleInputField } from "../elements/ele-input-field";
import { EleDropdownField } from "../elements/ele-dropdown-field-headword";
import { EleCollapsibleElement } from "../elements/ele-collapsible";
import React from "react";
import { attributeDefaultValues } from "../dmlex-spec";

export const EleTMD: React.FC<any> = (props) => {
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
				existingValue={props.flatTransformation[`${props.id}-inSelector`]}
			/>

			<EleInputField
				label="Namespaces"
				name={`${props.id}-namespaces`}
				className="text-sm font-medium text-indigo-600"
				existingValue={props.flatTransformation[`${props.id}-namespaces`]}
			/>
			<EleDropdownField
				label="Attribute"
				name={`${props.id}`}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				options={attributeDefaultValues}
				flatTransformation={props.flatTransformation}
			/>

			<EleInputField
				label="Regex"
				name={`${props.id}-regex`}
				className="text-sm font-medium text-indigo-600"
				existingValue={props.flatTransformation[`${props.id}-regex`]}
			/>

			<EleInputField
				label="RegexGroup"
				name={`${props.id}-regexGroup`}
				className="text-sm font-medium text-indigo-600"
				existingValue={props.flatTransformation[`${props.id}-regexGroup`]}
			/>
		</EleCollapsibleElement>
	);
};
