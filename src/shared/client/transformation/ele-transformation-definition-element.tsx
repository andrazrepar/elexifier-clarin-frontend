import { EleCollapsibleElement } from "../ele-collapsible";
import { EleInputField } from "../ele-input-field";
import { EleDropdownField } from "../ele-dropdown-field";
import { attributeDefaultValues } from "../../dmlex-spec";

export const EleTransformationDefinitionElement: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-sm font-medium text-indigo-600", // default class
	...props
}) => {
	return (
		<EleCollapsibleElement
			id={id}
			isExpanded={!!isSubElementExpanded[id]}
			handleExpand={handleExpand}
			label={label}
			className={className}
		>
			<EleInputField
				label="inSelector"
				name={`${id}-inSelector`}
				className="text-sm font-medium text-indigo-600"
				existingValue={props.existingValues?.inSelector}
			/>

			<EleDropdownField
				label="attribute"
				name={`${id}-attribute`}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				options={attributeDefaultValues}
				defaultValue={attributeDefaultValues.innerText}
			/>

			<EleInputField
				label="regex"
				name={`${id}-regex`}
				className="text-sm font-medium text-indigo-600"
				existingValue={
					props.existingValues?.textVals?.find(
						(el: any) => el.outElement === "value"
					)?.regex
				}
			/>

			<EleInputField
				label="regexGroup"
				name={`${id}-regexGroup`}
				className="text-sm font-medium text-indigo-600"
				existingValue={
					props.existingValues?.textVals?.find(
						(el: any) => el.outElement === "value"
					)?.regexGroup
				}
			/>

			<EleInputField
				label="inSelector (for definitionType)" // TODO come up with something better
				name={`${id}-definitonType-inSelector`}
				className="text-sm font-medium text-indigo-600"
				existingValue={
					props.existingValues?.textVals?.find(
						(el: any) => el.outElement === "definitionType"
					)?.regex
				}
			/>

			<EleDropdownField
				label="attribute"
				name={`${id}-definitionType-attribute`}
				className="flex-grow py-2 px-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
				options={attributeDefaultValues}
				defaultValue={attributeDefaultValues.innerText}
			/>

			<EleInputField
				label="regex"
				name={`${id}-definitionType-regex`}
				className="text-sm font-medium text-indigo-600"
				existingValue={
					props.existingValues?.textVals?.find(
						(el: any) => el.outElement === "definitionType"
					)?.regex
				}
			/>

			<EleInputField
				label="regexGroup"
				name={`${id}-definitionType-regexGroup`}
				className="text-sm font-medium text-indigo-600"
				existingValue={
					props.existingValues?.textVals?.find(
						(el: any) => el.outElement === "definitionType"
					)?.regexGroup
				}
			/>
		</EleCollapsibleElement>
	);
};
