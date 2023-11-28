import { EleCollapsibleElement } from "./ele-collapsible";
import { EleInputField } from "./ele-input-field";
import { EleDropdownField } from "./ele-dropdown-field";

export const EleDictionaryMetaData: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-xl font-semibold text-indigo-600 mb-3", // default class
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
				label="Title"
				name="dictionary-title"
				className="text-sm font-medium text-indigo-600"
				existingValue={props.dictionaryMetadata?.title}
			/>

			<EleInputField
				label="URI"
				name="dictionary-uri"
				className="text-sm font-medium text-indigo-600"
				existingValue={props.dictionaryMetadata?.uri}
			/>

			<EleInputField
				label="Language"
				name="dictionary-language"
				className="text-sm font-medium text-indigo-600"
				existingValue={props.dictionaryMetadata?.language}
			/>
		</EleCollapsibleElement>
	);
};
