import { EleCollapsibleElement } from "../ele-collapsible";
import { EleInputField } from "../ele-input-field";
import { EleDropdownField } from "../ele-dropdown-field";
import { attributeDefaultValues } from "../../dmlex-spec";
import JsonResult from "../ele-json-result";

export const EleTransformationHeadwordElement: React.FC<any> = ({
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
			<JsonResult result={props.entry.headword} />
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
				existingValue={props.existingValues?.regex}
			/>

			<EleInputField
				label="regexGroup"
				name={`${id}-regexGroup`}
				className="text-sm font-medium text-indigo-600"
				existingValue={props.existingValues?.regexGroup}
			/>

			{id.endsWith("partOfSpeech") && (
				<EleInputField
					label="xlat"
					name={`${id}-xlat`}
					className="text-sm font-medium text-indigo-600"
					existingValue={props.existingValues?.xlat}
				/>
			)}
		</EleCollapsibleElement>
	);
};
