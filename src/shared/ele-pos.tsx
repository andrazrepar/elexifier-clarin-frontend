import { EleCollapsibleElement } from "./client/ele-collapsible";
import { EleDropdownField } from "./client/ele-dropdown-field";
import { useState } from "react";
import eleApiService from "./ele-api-service";
import { EleButton } from "./client/ele-button";
import { attributeDefaultValues } from "./dmlex-spec";

const UD_TAGS = [
	{ label: "ADJ", value: "ADJ" },
	{ label: "ADV", value: "ADV" },
	{ label: "INTJ", value: "INTJ" },
	{ label: "NOUN", value: "NOUN" },
	{ label: "PROPN", value: "PROPN" },
	{ label: "VERB", value: "VERB" },
	{ label: "ADP", value: "ADP" },
	{ label: "AUX", value: "AUX" },
	{ label: "CCONJ", value: "CCONJ" },
	{ label: "DET", value: "DET" },
	{ label: "NUM", value: "NUM" },
	{ label: "PART", value: "PART" },
	{ label: "PRON", value: "PRON" },
	{ label: "SCONJ", value: "SCONJ" },
	{ label: "PUNCT", value: "PUNCT" },
	{ label: "SYM", value: "SYM" },
	{ label: "X", value: "X" },
];

const custom_tags = ["substantief", "adjectief", "werkwoord", "bijwoord"];

export const ElePosMapping: React.FC<any> = ({
	id,
	handleExpand,
	label,
	isSubElementExpanded,
	className = "text-xl font-semibold text-indigo-600 mb-3", // default class
	...props
}) => {
	console.log(props.transformation.children);

	const posElement = props.transformation.children
		?.find((el: any) => el.outElement === "entry")
		?.children?.find((el: any) => el.outElement === "partOfSpeech");

	const xlat = posElement?.textVals[0].xlat;

	console.log("xlat", xlat);

	const [customTags, setCustomTags] = useState<string[]>(
		xlat ? Object.keys(xlat) : []
	);

	const handleLoadCustomTags = async (event: React.MouseEvent) => {
		event.stopPropagation(); // prevent event from bubbling up

		let customTagsFromFileResponse = await eleApiService.getPosElements(
			props.dictionaryId,
			posElement?.inSelector
		);

		let customTagsFromFile = await customTagsFromFileResponse.json();
		console.log(customTagsFromFile);

		// append custom tags to the list of tags and make the list unique
		setCustomTags(
			Array.from(new Set([...customTags, ...customTagsFromFile.pos_elements]))
		);
	};

	return (
		<EleCollapsibleElement
			id={id}
			isExpanded={!!isSubElementExpanded[id]}
			handleExpand={handleExpand}
			label={label}
			className={className}
		>
			{customTags.map((tag, index) => (
				<EleDropdownField
					key={index}
					name={`ud-mapping-${tag}`}
					label={tag}
					options={[{ label: "", value: "" }, ...UD_TAGS]}
					defaultValue={
						UD_TAGS.find(
							(option) =>
								option.value === (xlat[tag] ? xlat[tag].toUpperCase() : "")
						)?.value
					}
				/>
			))}

			<EleButton
				label="Load POS"
				value="load-custom-tags"
				onClick={(event) => handleLoadCustomTags(event)}
			/>
		</EleCollapsibleElement>
	);
};
