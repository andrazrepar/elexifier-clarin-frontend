/*export const attributeDefaultValues = {
	constant: "{http://elex.is/wp1/teiLex0Mapper/meta}constant",
	autogenerated: "{http://elex.is/wp1/teiLex0Mapper/meta}autogenerated",
	innerText: "{http://elex.is/wp1/teiLex0Mapper/meta}innerText",
	innerTextRec: "{http://elex.is/wp1/teiLex0Mapper/meta}innerTextRec",
};*/

export const attributeDefaultValues = [
	{
		name: "constant",
		value: "{http://elex.is/wp1/teiLex0Mapper/meta}constant",
	},
	{
		name: "autogenerated",
		value: "{http://elex.is/wp1/teiLex0Mapper/meta}autogenerated",
	},
	{
		name: "innerText",
		value: "{http://elex.is/wp1/teiLex0Mapper/meta}innerText",
	},
	{
		name: "innerTextRec",
		value: "{http://elex.is/wp1/teiLex0Mapper/meta}innerTextRec",
	},
];

// tags not supported yet

interface Namespace {
	prefix: string;
	uri: string;
}

interface DmlexSpecParams {
	fieldsToUpdate: Object;
	formData: FormData;
	namespaces?: Namespace[] | null;
	dictSelector: string;
	entrySelector: string;
	dictionaryTitle: string;
	dictionaryUri: string;
	dictionaryLanguage: string;
	xlat: { [key: string]: string } | null;
}

//TODO: add metadata from database as constant values

export function createDmlexSpec({
	fieldsToUpdate,
	formData,
	namespaces = null,
	dictSelector,
	entrySelector,
	dictionaryTitle,
	dictionaryUri,
	dictionaryLanguage,
	xlat,
}: DmlexSpecParams) {
	return {
		inSelector: `/${dictSelector}`,
		namespaces: namespaces,
		outElement: "lexicographicResource",
		textVals: [
			{
				attribute: attributeDefaultValues.find(
					(item) => item.name === "constant"
				)?.value,
				outElement: "title",
				constant: dictionaryTitle,
			},
			{
				outElement: "uri",
				attribute: attributeDefaultValues.find(
					(item) => item.name === "constant"
				)?.value,
				constant: dictionaryUri,
			},
			{
				attribute: attributeDefaultValues.find(
					(item) => item.name === "constant"
				)?.value,
				constant: dictionaryLanguage,
				outElement: "language",
			},
		],
		children: [
			{
				inSelector: entrySelector,
				namespaces: namespaces,
				outElement: "entry",
				required: true,
				textVals: [
					{
						outElement: "id",
						attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}autogenerated",
						required: true, // let's say that the id is required despite being optional in dmlex
					},
					{
						inSelector: formData.get("entry-headword-inSelector") as string,
						namespaces: namespaces,
						attribute: formData.get("entry-headword-attribute") as string,
						constant: formData.get(
							"entry-headword-attribute-constant"
						) as string,
						regex: formData.get("entry-headword-regex") as string,
						regexGroup: formData.get("entry-headword-regexGroup") as string,
						outElement: "headword",
						required: true,
					},
					{
						inSelector: formData.get(
							"entry-homographNumber-inSelector"
						) as string,
						namespaces: namespaces,
						attribute: formData.get(
							"entry-homographNumber-attribute"
						) as string,
						constant: formData.get(
							"entry-homographNumber-attribute-constant"
						) as string,
						regex: formData.get("entry-homographNumber-regex") as string,
						regexGroup: formData.get(
							"entry-homographNumber-regexGroup"
						) as string,
						outElement: "homographNumber",
						required: false,
					},
				],
				children: [
					{
						inSelector: formData.get("entry-partOfSpeech-inSelector") as string,
						namespaces: namespaces,
						outElement: "partOfSpeech", // for the moment we are not supporting the xlat attribute, probably need to do something with tags
						required: false,
						textVals: [
							{
								//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
								namespaces: namespaces,
								attribute: formData.get(
									"entry-partOfSpeech-attribute"
								) as string,
								constant: formData.get(
									"entry-partOfSpeech-attribute-constant"
								) as string,
								regex: formData.get("entry-partOfSpeech-regex") as string,
								regexGroup: formData.get(
									"entry-partOfSpeech-regexGroup"
								) as string,
								outElement: "value",
								xlat: xlat,
								required: true,
							},
						],
					},
					{
						inSelector: formData.get("entry-label-inSelector") as string,
						namespaces: namespaces,
						outElement: "label",
						required: false,
						textVals: [
							{
								//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
								namespaces: namespaces,
								attribute: formData.get("entry-label-attribute") as string,
								constant: formData.get(
									"entry-label-attribute-constant"
								) as string,
								regex: formData.get("entry-label-regex") as string,
								regexGroup: formData.get("entry-label-regexGroup") as string,
								outElement: "value",
								required: true,
							},
						],
					},
					{
						inSelector: formData.get(
							"entry-pronounciation-inSelector"
						) as string,
						namespaces: namespaces,
						outElement: "pronunciation",
						required: false,
						textVals: [
							{
								outElement: "soundFile",
								attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}constant",
								constant: formData.get(
									"entry-pronounciation-soundFile"
								) as string,
								required: false,
							},
						],
						children: [
							{
								inSelector: formData.get(
									"entry-pronounciation-label-inSelector"
								) as string,
								namespaces: namespaces,
								outElement: "label",
								required: false,
								textVals: [
									{
										//, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
										namespaces: namespaces,
										attribute: formData.get(
											"entry-pronounciation-label-attribute"
										) as string,
										constant: formData.get(
											"entry-pronounciation-label-attribute-constant"
										) as string,
										regex: formData.get(
											"entry-pronounciation-label-regex"
										) as string,
										regexGroup: formData.get(
											"entry-pronounciation-label-regexGroup"
										) as string,
										outElement: "value",
										required: true,
									},
								],
							},
							{
								inSelector: formData.get(
									"entry-pronounciation-transcription-inSelector"
								) as string,
								namespaces: namespaces,
								outElement: "transcription",
								required: false,
								textVals: [
									{
										//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
										namespaces: namespaces,
										attribute: formData.get(
											"entry-pronounciation-transcription-attribute"
										) as string,
										constant: formData.get(
											"entry-pronounciation-transcription-attribute-constant"
										) as string,
										regex: formData.get(
											"entry-pronounciation-transcription-regex"
										) as string,
										regexGroup: formData.get(
											"entry-pronounciation-transcription-regexGroup"
										) as string,
										outElement: "text",
										required: true,
									},
									{
										outElement: "scheme",
										attribute:
											"{http://elex.is/wp1/teiLex0Mapper/meta}constant",
										constant: formData.get(
											"entry-pronounciation-transcription-scheme"
										) as string,
										required: false,
									},
								],
							},
						],
					},
					{
						inSelector: formData.get(
							"entry-inflectedForm-inSelector"
						) as string,
						namespaces: namespaces,
						outElement: "inflectedForm",
						required: false,
						textVals: [
							{
								//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
								namespaces: namespaces,
								attribute: formData.get(
									"entry-inflectedForm-attribute"
								) as string,
								constant: formData.get(
									"entry-inflectedForm-attribute-constant"
								) as string,
								regex: formData.get("entry-inflectedForm-regex") as string,
								regexGroup: formData.get(
									"entry-inflectedForm-regexGroup"
								) as string,
								outElement: "text",
								required: true,
							},
						],
						children: [
							{
								inSelector: formData.get(
									"entry-inflectedForm-label-inSelector"
								) as string,
								namespaces: namespaces,
								outElement: "label",
								required: false,
								textVals: [
									{
										inSelector: formData.get(
											"entry-inflectedForm-label-inSelector"
										) as string,
										namespaces: namespaces,
										attribute: formData.get(
											"entry-inflectedForm-label-attribute"
										) as string,
										constant: formData.get(
											"entry-inflectedForm-label-attribute-constant"
										) as string,
										regex: formData.get(
											"entry-inflectedForm-label-regex"
										) as string,
										regexGroup: formData.get(
											"entry-inflectedForm-label-regexGroup"
										) as string,
										outElement: "value",
										required: true,
									},
								],
							},
							{
								inSelector: formData.get(
									"entry-inflectedForm-pronounciation-inSelector"
								) as string,
								namespaces: namespaces,
								outElement: "pronunciation",
								required: false,
								textVals: [
									{
										outElement: "soundFile",
										attribute:
											"{http://elex.is/wp1/teiLex0Mapper/meta}constant",
										constant: formData.get(
											"entry-inflectedForm-pronounciation-attribute-constant"
										) as string,
										required: false,
									},
								],
								children: [
									{
										inSelector: formData.get(
											"entry-inflectedForm-pronounciation-label-inSelector"
										) as string,
										namespaces: namespaces,
										outElement: "label",
										required: false,
										textVals: [
											{
												inSelector: formData.get(
													"entry-inflectedForm-pronounciation-label-inSelector"
												) as string,
												namespaces: namespaces,
												attribute: formData.get(
													"entry-inflectedForm-pronounciation-label-attribute"
												) as string,
												constant: formData.get(
													"entry-inflectedForm-pronounciation-label-attribute-constant"
												) as string,
												regex: formData.get(
													"entry-inflectedForm-pronounciation-label-regex"
												) as string,
												regexGroup: formData.get(
													"entry-inflectedForm-pronounciation-label-regexGroup"
												) as string,
												outElement: "value",
												required: true,
											},
										],
									},
									{
										inSelector: formData.get(
											"entry-inflectedForm-pronounciation-transcription-inSelector"
										) as string,
										namespaces: namespaces,
										outElement: "transcription",
										required: false,
										textVals: [
											{
												inSelector: formData.get(
													"entry-inflectedForm-pronounciation-transcription-inSelector"
												) as string,
												namespaces: namespaces,
												attribute: formData.get(
													"entry-inflectedForm-pronounciation-transcription-attribute"
												) as string,
												constant: formData.get(
													"entry-inflectedForm-pronounciation-transcription-attribute-constant"
												) as string,
												regex: formData.get(
													"entry-inflectedForm-pronounciation-transcription-regex"
												) as string,
												regexGroup: formData.get(
													"entry-inflectedForm-pronounciation-transcription-regexGroup"
												) as string,
												outElement: "text",
												required: true,
											},
											{
												outElement: "scheme",
												attribute:
													"{http://elex.is/wp1/teiLex0Mapper/meta}constant",
												constant: formData.get(
													"entry-inflectedForm-pronounciation-transcription-scheme"
												) as string,
												required: false,
											},
										],
									},
								],
							},
						],
					},
					{
						inSelector: formData.get("entry-sense-inSelector") as string,
						namespaces: namespaces,
						outElement: "sense",
						required: false,
						textVals: [
							{
								outElement: "id",
								attribute:
									"{http://elex.is/wp1/teiLex0Mapper/meta}autogenerated", // perhaps we need to generate specific ids for senses for linking?
								required: true, // let's say that the id is required despite being optional in dmlex
							},
							{
								inSelector: formData.get(
									"entry-sense-indicator-inSelector"
								) as string,
								namespaces: namespaces,
								attribute: formData.get(
									"entry-sense-indicator-attribute"
								) as string,
								constant: formData.get(
									"entry-sense-indicator-attribute-constant"
								) as string,
								regex: formData.get("entry-sense-indicator-regex") as string,
								regexGroup: formData.get(
									"entry-sense-indicator-regexGroup"
								) as string,
								outElement: "indicator",
								required: false,
							},
						],
						children: [
							{
								inSelector: formData.get(
									"entry-sense-label-inSelector"
								) as string,
								namespaces: namespaces,
								outElement: "label",
								required: false,
								textVals: [
									{
										//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
										namespaces: namespaces,
										attribute: formData.get(
											"entry-sense-label-attribute"
										) as string,
										constant: formData.get(
											"entry-sense-label-attribute-constant"
										) as string,
										regex: formData.get("entry-sense-label-regex") as string,
										regexGroup: formData.get(
											"entry-sense-label-regexGroup"
										) as string,
										outElement: "value",
										required: true,
									},
								],
							},
							{
								inSelector: formData.get(
									"entry-sense-definition-inSelector"
								) as string,
								namespaces: namespaces,
								outElement: "definition",
								required: false,
								textVals: [
									{
										//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
										namespaces: namespaces,
										attribute: formData.get(
											"entry-sense-definition-attribute"
										) as string,
										constant: formData.get(
											"entry-sense-definition-attribute-constant"
										) as string,
										regex: formData.get(
											"entry-sense-definition-regex"
										) as string,
										regexGroup: formData.get(
											"entry-sense-definition-regexGroup"
										) as string,
										outElement: "value",
										required: true,
									},
									{
										inSelector: formData.get(
											"entry-sense-definition-definitionType-inSelector"
										) as string,
										namespaces: namespaces,
										attribute: formData.get(
											"entry-sense-definition-definitionType-attribute"
										) as string,
										constant: formData.get(
											"entry-sense-definition-definitionType-attribute-constant"
										) as string,
										regex: formData.get(
											"entry-sense-definition-definitionType-regex"
										) as string,
										regexGroup: formData.get(
											"entry-sense-definition-definitionType-regexGroup"
										) as string,
										outElement: "definitionType",
										required: true,
									},
								],
							},
							{
								inSelector: formData.get(
									"entry-sense-example-inSelector"
								) as string,
								namespaces: namespaces,
								outElement: "example",
								required: false,
								textVals: [
									{
										//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
										namespaces: namespaces,
										attribute: formData.get(
											"entry-sense-example-attribute"
										) as string,
										constant: formData.get(
											"entry-sense-example-attribute-constant"
										) as string,
										regex: formData.get("entry-sense-example-regex") as string,
										regexGroup: formData.get(
											"entry-sense-example-regexGroup"
										) as string,
										outElement: "text",
										required: true,
									},
									{
										inSelector: formData.get(
											"entry-sense-example-sourceIdentity-inSelector"
										) as string,
										namespaces: namespaces,
										attribute: formData.get(
											"entry-sense-example-sourceIdentity-attribute"
										) as string,
										constant: formData.get(
											"entry-sense-example-sourceIdentity-attribute-constant"
										) as string,
										regex: formData.get(
											"entry-sense-example-sourceIdentity-regex"
										) as string,
										regexGroup: formData.get(
											"entry-sense-example-sourceIdentity-regexGroup"
										) as string,
										outElement: "sourceIdentity",
										required: true,
									},
									{
										inSelector: formData.get(
											"entry-sense-example-sourceElaboration-inSelector"
										) as string,
										namespaces: namespaces,
										attribute: formData.get(
											"entry-sense-example-sourceElaboration-attribute"
										) as string,
										constant: formData.get(
											"entry-sense-example-sourceElaboration-attribute-constant"
										) as string,
										regex: formData.get(
											"entry-sense-example-sourceElaboration-regex"
										) as string,
										regexGroup: formData.get(
											"entry-sense-example-sourceElaboration-regexGroup"
										) as string,
										outElement: "sourceElaboration",
										required: true,
									},
									{
										outElement: "soundFile",
										attribute:
											"{http://elex.is/wp1/teiLex0Mapper/meta}constant",
										constant: formData.get(
											"entry-sense-example-soundFile-attribute-constant"
										) as string,
										required: false,
									},
								],
								children: [
									{
										inSelector: formData.get(
											"entry-sense-example-label-inSelector"
										) as string,
										namespaces: namespaces,
										outElement: "label",
										required: false,
										textVals: [
											{
												//inSelector: null, // stays null because it is optional and the value will be taken from the parent above, see Capybara for details
												namespaces: namespaces,
												attribute: formData.get(
													"entry-sense-example-label-attribute"
												) as string,
												constant: formData.get(
													"entry-sense-example-label-attribute-constant"
												) as string,
												regex: formData.get(
													"entry-sense-example-label-regex"
												) as string,
												regexGroup: formData.get(
													"entry-sense-example-label-regexGroup"
												) as string,
												outElement: "value",
												required: true,
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	};
}

export function generateDefaultTransformation(
	entry: string,
	lemma: string,
	lexicographicResource: string,
	name: string,
	dictionaryId: Number,
	dictionaryTitle: string,
	dictionaryUri: string,
	dictionaryLanguage: string
) {
	return {
		entry: entry,
		lemma: lemma,
		lexicographic_resource: lexicographicResource,
		name: name,
		file_id: dictionaryId,
		transformation: {
			inSelector: `/${lexicographicResource}`,
			namespaces: null,
			outElement: "lexicographicResource",
			textVals: [
				{
					attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}constant",
					constant: dictionaryTitle,
					outElement: "title",
				},
				{
					attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}constant",
					constant: dictionaryUri,
					outElement: "uri",
				},
				{
					attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}constant",
					constant: dictionaryLanguage,
					outElement: "language",
				},
			],
			children: [
				{
					inSelector: `.//${entry}`,
					outElement: "entry",
					namespaces: null,
					required: true,
					textVals: [
						{
							inSelector: `.//${lemma}`,
							outElement: "headword",
							attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}innerText",
							constant: null,
							namespaces: null,
							required: true,
						},
						{
							attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}autogenerated",
							outElement: "id",
							required: true,
						},
					],
				},
			],
		},
	};
}
