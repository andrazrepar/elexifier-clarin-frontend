export function findEMDs(
	transformation: any,
	targetChain: string[],
	parentChain: string[] = []
): any[] {
	if (
		transformation.outElement === targetChain[parentChain.length] &&
		parentChain.join(".") === targetChain.slice(0, parentChain.length).join(".")
	) {
		if (parentChain.length + 1 === targetChain.length) {
			return [transformation];
		}
	}

	if (transformation.children) {
		for (let child of transformation.children) {
			let result = findEMDs(child, targetChain, [
				...parentChain,
				transformation.outElement,
			]);
			if (result.length > 0) {
				return result;
			}
		}
	}

	return [{}];
}

export function findTMD(EMD: any, outElement: string): any[] {
	const TMD = EMD.textVals?.find((e: any) => e.outElement === outElement);
	return TMD;
}

export function getOutElementPaths(obj, path = "", index = 0) {
	let result = {};

	for (let key in obj) {
		let outElement = obj["outElement"];
		let newPath =
			path === ""
				? `${outElement}${index}`
				: key === "textVals" || key === "children"
				? `${path}-${outElement}${index}`
				: `${path}-${outElement}${index}-${key}`;

		if (key !== "outElement" && key !== "children" && key !== "textVals") {
			result[newPath] = obj[key];
		}

		if (key === "children") {
			let groups = {};
			for (let child of obj[key]) {
				// Group children by their outElement
				let childOutElement = child["outElement"];
				if (!groups[childOutElement]) {
					groups[childOutElement] = [];
				}
				groups[childOutElement].push(child);
			}

			// Process each group separately
			for (let group in groups) {
				let groupChildren = groups[group];
				groupChildren.forEach((child, index) => {
					result = {
						...result,
						...getOutElementPaths(child, newPath, index),
					};
				});
			}
		} else if (key === "textVals") {
			for (let child of obj[key]) {
				let childOutElement = child["outElement"];
				let childPath = `${newPath}-${childOutElement}`;
				for (let childKey in child) {
					if (childKey !== "outElement") {
						result[`${childPath}-${childKey}`] = child[childKey];
					}
				}
			}
		}
	}
	return result;
}

export function countExistingEMDs(obj, inputs, existingCounts = {}) {
	let result = { ...existingCounts };
	inputs.forEach((input) => {
		const keys = Object.keys(obj);
		const filteredKeys = keys.filter((key) => key.startsWith(input));
		if (filteredKeys.length === 0) {
			if (!result[input]) {
				result[input] = 1;
			}
		} else {
			const nextChars = filteredKeys.map((key) => parseInt(key[input.length]));
			const maxIndex = Math.max(...nextChars);
			if (!result[input] || maxIndex + 1 > result[input]) {
				result[input] = maxIndex + 1;
			}
		}
	});
	return result;
}

export function removeNullInSelector(obj: any) {
	if (Array.isArray(obj)) {
		return obj
			.map((v) => {
				if (v.inSelector === null || v.inSelector === "") {
					return null;
				}
				return removeNullInSelector(v);
			})
			.filter((n) => n);
	} else if (typeof obj === "object" && obj !== null) {
		if (
			!("inSelector" in obj) &&
			obj.attribute === "{http://elex.is/wp1/teiLex0Mapper/meta}constant" &&
			obj.constant === null
		) {
			return null; // If 'inSelector' is not present and 'constant' is null, return null
		}

		Object.keys(obj).forEach((key) => {
			if (key === "inSelector" && obj[key] === null) {
				delete obj[key];
			} else if (key === "regex" && obj[key] === "") {
				delete obj[key];
			} else if (key === "regexGroup" && obj[key] === "") {
				delete obj[key];
			} else {
				obj[key] = removeNullInSelector(obj[key]);
			}
		});
	}
	return obj;
}

export function setSimpleOrAdvanced(
	formData: FormData,
	advancedMode: boolean
): FormData {
	// Convert formData to a plain object
	let objectData: { [key: string]: any } = {};
	formData.forEach((value, key) => {
		objectData[key] = value;
	});

	// Apply the setSimpleOrAdvanced function
	if (advancedMode === true) {
		Object.keys(objectData).forEach((key) => {
			if (key.endsWith("inSelector-simple")) {
				delete objectData[key];
			} else if (key.endsWith("inSelector-advanced")) {
				objectData[key.replace("-advanced", "")] = objectData[key];
				delete objectData[key];
			}
		});
	} else {
		Object.keys(objectData).forEach((key) => {
			if (key.endsWith("inSelector-advanced")) {
				delete objectData[key];
			} else if (key.endsWith("inSelector-simple")) {
				objectData[key.replace("-simple", "")] = objectData[key];
				delete objectData[key];
			}
		});
	}

	// Convert the object back to FormData
	let updatedFormData = new FormData();
	Object.keys(objectData).forEach((key) => {
		updatedFormData.append(key, objectData[key]);
	});

	return updatedFormData;
}

export function createXlatAndFieldsToUpdate(formData: FormData): {
	xlat: { [key: string]: any };
	fieldsToUpdate: { [key: string]: any };
} {
	let fieldsToUpdate: { [key: string]: any } = Object.fromEntries(formData);

	// create xlat mapping and remove from fieldsToUpdate
	let xlat: { [key: string]: any } = {};
	Object.keys(fieldsToUpdate).forEach((key) => {
		if (key.startsWith("ud-mapping")) {
			// Remove 'ud-mapping-' from the key and add the key-value pair to xlat
			let newKey = key.replace("ud-mapping-", "");
			let udValue = fieldsToUpdate[key].toLowerCase();

			if (udValue !== "") {
				xlat[newKey] = udValue;
			}

			// Remove the key-value pair from fieldsToUpdate
			delete fieldsToUpdate[key];
		}
	});

	return { xlat, fieldsToUpdate };
}

export function assignIfNotEmpty(
	source: { [key: string]: any },
	target: { [key: string]: any },
	key: string
) {
	let parts = key.split("-");
	if (key in source && source[key] !== "") {
		target[parts[parts.length - 1]] = source[key];
	}
}

export function countOccurrences(prefix, obj) {
	let uniqueKeys = new Set();
	for (let key in obj) {
		if (
			key.startsWith(prefix) &&
			key.match(
				new RegExp(
					`^${prefix}\\d+(-inSelector|-namespaces|-attribute|-regex|-regexGroup|-constant)$`
				)
			)
		) {
			uniqueKeys.add(key.match(new RegExp(`^(${prefix}\\d+)`))[1]);
		}
	}
	return uniqueKeys;
}

export function assignTMD(
	fieldsToUpdate: { [key: string]: any },
	key: string,
	tmdName: string
) {
	let tmd = {};

	assignIfNotEmpty(fieldsToUpdate, tmd, `${key}-${tmdName}-inSelector`);
	assignIfNotEmpty(fieldsToUpdate, tmd, `${key}-${tmdName}-attribute`);
	assignIfNotEmpty(fieldsToUpdate, tmd, `${key}-${tmdName}-regex`);
	assignIfNotEmpty(fieldsToUpdate, tmd, `${key}-${tmdName}-regexGroup`);
	assignIfNotEmpty(fieldsToUpdate, tmd, `${key}-${tmdName}-constant`);
	tmd["outElement"] = tmdName;
	return tmd;
}

export function assignEMD(
	fieldsToUpdate: { [key: string]: any },
	prefix: string,
	outElement: string,
	newTransformation: { [key: string]: any },
	xlat?: { [key: string]: any }
) {
	let uniqueEmds = countOccurrences(prefix, fieldsToUpdate);

	uniqueEmds.forEach((key) => {
		let emd = {};
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-inSelector`);
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-namespaces`);

		emd["textVals"] = [];
		let tmd = assignTMD(fieldsToUpdate, key, "tag");

		if (xlat) {
			tmd["xlat"] = xlat;
		}
		emd["textVals"].push(tmd);
		emd["outElement"] = outElement;

		// check if emd contains key inSelector
		if (emd.inSelector) {
			newTransformation["children"].push(emd);
		}
	});
}

export function assignPronunciation(
	fieldsToUpdate: { [key: string]: any },
	prefix: string,
	outElement: string,
	newTransformation: { [key: string]: any }
) {
	let uniqueEmds = countOccurrences(prefix, fieldsToUpdate);

	uniqueEmds.forEach((key) => {
		let emd = {};
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-inSelector`);
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-namespaces`);

		emd["textVals"] = [];
		let tmd = assignTMD(fieldsToUpdate, key, "soundFile");
		emd["textVals"].push(tmd);

		emd["children"] = [];
		let uniquePronunciationLabels = countOccurrences(
			`${key}-label`,
			fieldsToUpdate
		);

		uniquePronunciationLabels.forEach((labelKey) => {
			let pronunciationLabel = {};
			assignIfNotEmpty(
				fieldsToUpdate,
				pronunciationLabel,
				`${labelKey}-inSelector`
			);
			assignIfNotEmpty(
				fieldsToUpdate,
				pronunciationLabel,
				`${labelKey}-namespaces`
			);

			pronunciationLabel["textVals"] = [];
			let pronunciationLableTmd = assignTMD(fieldsToUpdate, labelKey, "tag");
			pronunciationLabel["textVals"].push(pronunciationLableTmd);
			pronunciationLabel["outElement"] = "label";

			if (pronunciationLabel.inSelector) {
				emd["children"].push(pronunciationLabel);
			}
		});

		let uniqueTranscriptions = countOccurrences(
			`${key}-transcription`,
			fieldsToUpdate
		);

		uniqueTranscriptions.forEach((transcriptionKey) => {
			let transcription = {};
			assignIfNotEmpty(
				fieldsToUpdate,
				transcription,
				`${transcriptionKey}-inSelector`
			);
			assignIfNotEmpty(
				fieldsToUpdate,
				transcription,
				`${transcriptionKey}-namespaces`
			);

			transcription["textVals"] = [];
			let textTmd = assignTMD(fieldsToUpdate, transcriptionKey, "text");
			transcription["textVals"].push(textTmd);

			let schemeTmd = assignTMD(fieldsToUpdate, transcriptionKey, "scheme");
			if (schemeTmd.inSelector || schemeTmd.constant) {
				transcription["textVals"].push(schemeTmd);
			}

			transcription["outElement"] = "transcription";

			emd["children"].push(transcription);
		});

		emd["outElement"] = outElement;
		if (emd.inSelector) {
			newTransformation["children"].push(emd);
		}
	});
}

export function assignInflectedForm(
	fieldsToUpdate: { [key: string]: any },
	prefix: string,
	outElement: string,
	newTransformation: { [key: string]: any }
) {
	let uniqueEmds = countOccurrences(prefix, fieldsToUpdate);

	uniqueEmds.forEach((key) => {
		let emd = {};
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-inSelector`);
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-namespaces`);

		emd["textVals"] = [];
		let textTmd = assignTMD(fieldsToUpdate, key, "text");

		emd["textVals"].push(textTmd);

		let tagTmd = assignTMD(fieldsToUpdate, key, "tag");
		// assign tag only if inSelector or constant present, because otherwise the same value may be assigned to text and tag (in case only the parent inSelector is present)
		if (tagTmd.inSelector || tagTmd.constant) {
			emd["textVals"].push(tagTmd);
		}

		emd["children"] = [];
		let uniqueInflectedFormLabels = countOccurrences(
			`${key}-label`,
			fieldsToUpdate
		);

		uniqueInflectedFormLabels.forEach((labelKey) => {
			let inflectedFormLabel = {};
			assignIfNotEmpty(
				fieldsToUpdate,
				inflectedFormLabel,
				`${labelKey}-inSelector`
			);
			assignIfNotEmpty(
				fieldsToUpdate,
				inflectedFormLabel,
				`${labelKey}-namespaces`
			);

			inflectedFormLabel["textVals"] = [];
			let inflectedFormLabelTmd = assignTMD(fieldsToUpdate, labelKey, "tag");
			inflectedFormLabel["textVals"].push(inflectedFormLabelTmd);
			inflectedFormLabel["outElement"] = "label";

			if (inflectedFormLabel.inSelector) {
				emd["children"].push(inflectedFormLabel);
			}
		});

		let uniqueInflectedFormPronunciations = countOccurrences(
			`${key}-pronunciation`,
			fieldsToUpdate
		);

		uniqueInflectedFormPronunciations.forEach((pronunciationKey) => {
			let inflectedFormPronunciation = {};
			assignIfNotEmpty(
				fieldsToUpdate,
				inflectedFormPronunciation,
				`${pronunciationKey}-inSelector`
			);
			assignIfNotEmpty(
				fieldsToUpdate,
				inflectedFormPronunciation,
				`${pronunciationKey}-namespaces`
			);

			inflectedFormPronunciation["textVals"] = [];
			let tmd = assignTMD(fieldsToUpdate, pronunciationKey, "soundFile");
			inflectedFormPronunciation["textVals"].push(tmd);

			inflectedFormPronunciation["children"] = [];

			let inflectedFormPronunciationLabels = countOccurrences(
				`${pronunciationKey}-label`,
				fieldsToUpdate
			);

			inflectedFormPronunciationLabels.forEach((labelKey) => {
				let inflectedFormPronunciationLabel = {};
				assignIfNotEmpty(
					fieldsToUpdate,
					inflectedFormPronunciationLabel,
					`${labelKey}-inSelector`
				);
				assignIfNotEmpty(
					fieldsToUpdate,
					inflectedFormPronunciationLabel,
					`${labelKey}-namespaces`
				);

				inflectedFormPronunciationLabel["textVals"] = [];
				let inflectedFormPronunciationLabelTmd = assignTMD(
					fieldsToUpdate,
					labelKey,
					"tag"
				);
				inflectedFormPronunciationLabel["textVals"].push(
					inflectedFormPronunciationLabelTmd
				);
				inflectedFormPronunciationLabel["outElement"] = "label";

				if (inflectedFormPronunciationLabel.inSelector) {
					inflectedFormPronunciation["children"].push(
						inflectedFormPronunciationLabel
					);
				}
			});

			let inflectedFormPronunciationTranscriptions = countOccurrences(
				`${pronunciationKey}-transcription`,
				fieldsToUpdate
			);

			inflectedFormPronunciationTranscriptions.forEach((transcriptionKey) => {
				let inflectedFormPronunciationTranscription = {};
				assignIfNotEmpty(
					fieldsToUpdate,
					inflectedFormPronunciationTranscription,
					`${transcriptionKey}-inSelector`
				);
				assignIfNotEmpty(
					fieldsToUpdate,
					inflectedFormPronunciationTranscription,
					`${transcriptionKey}-namespaces`
				);

				inflectedFormPronunciationTranscription["textVals"] = [];
				let textTmd = assignTMD(fieldsToUpdate, transcriptionKey, "text");
				inflectedFormPronunciationTranscription["textVals"].push(textTmd);

				let schemeTmd = assignTMD(fieldsToUpdate, transcriptionKey, "scheme");
				if (schemeTmd.inSelector || schemeTmd.constant) {
					inflectedFormPronunciationTranscription["textVals"].push(schemeTmd);
				}

				inflectedFormPronunciationTranscription["outElement"] = "transcription";

				inflectedFormPronunciation["outElement"] = "pronunciation";

				if (inflectedFormPronunciationTranscription.inSelector) {
					inflectedFormPronunciation["children"].push(
						inflectedFormPronunciationTranscription
					);
				}
			});

			if (inflectedFormPronunciation.inSelector) {
				emd["children"].push(inflectedFormPronunciation);
			}
		});
		emd["outElement"] = outElement;
		if (emd.inSelector) {
			newTransformation["children"].push(emd);
		}
	});
}

export function assignSense(
	fieldsToUpdate: { [key: string]: any },
	prefix: string,
	outElement: string,
	newTransformation: { [key: string]: any }
) {
	let uniqueEmds = countOccurrences(prefix, fieldsToUpdate);

	uniqueEmds.forEach((key) => {
		let emd = {};
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-inSelector`);
		assignIfNotEmpty(fieldsToUpdate, emd, `${key}-namespaces`);

		emd["textVals"] = [];
		let tmd = assignTMD(fieldsToUpdate, key, "indicator");
		if (tmd.inSelector || tmd.constant) {
			emd["textVals"].push(tmd);
		}

		emd["children"] = [];
		let uniqueSenseLabels = countOccurrences(`${key}-label`, fieldsToUpdate);

		uniqueSenseLabels.forEach((labelKey) => {
			let senseLabel = {};
			assignIfNotEmpty(fieldsToUpdate, senseLabel, `${labelKey}-inSelector`);
			assignIfNotEmpty(fieldsToUpdate, senseLabel, `${labelKey}-namespaces`);

			senseLabel["textVals"] = [];
			let senseLabelTmd = assignTMD(fieldsToUpdate, labelKey, "tag");
			senseLabel["textVals"].push(senseLabelTmd);
			senseLabel["outElement"] = "label";

			if (senseLabel.inSelector) {
				emd["children"].push(senseLabel);
			}
		});

		let uniqueSenseDefinitions = countOccurrences(
			`${key}-definition`,
			fieldsToUpdate
		);

		uniqueSenseDefinitions.forEach((definitionKey) => {
			let senseDefinition = {};
			assignIfNotEmpty(
				fieldsToUpdate,
				senseDefinition,
				`${definitionKey}-inSelector`
			);
			assignIfNotEmpty(
				fieldsToUpdate,
				senseDefinition,
				`${definitionKey}-namespaces`
			);

			senseDefinition["textVals"] = [];
			let senseDefinitionTmd = assignTMD(fieldsToUpdate, definitionKey, "text");
			senseDefinition["textVals"].push(senseDefinitionTmd);

			let senseDefinitionTypeTmd = assignTMD(
				fieldsToUpdate,
				definitionKey,
				"definitionType"
			);

			if (
				senseDefinitionTypeTmd.inSelector ||
				senseDefinitionTypeTmd.constant
			) {
				senseDefinition["textVals"].push(senseDefinitionTypeTmd);
			}

			senseDefinition["outElement"] = "definition";

			if (senseDefinition.inSelector) {
				emd["children"].push(senseDefinition);
			}
		});

		let uniqueSenseExamples = countOccurrences(
			`${key}-example`,
			fieldsToUpdate
		);

		uniqueSenseExamples.forEach((exampleKey) => {
			let senseExample = {};
			assignIfNotEmpty(
				fieldsToUpdate,
				senseExample,
				`${exampleKey}-inSelector`
			);
			assignIfNotEmpty(
				fieldsToUpdate,
				senseExample,
				`${exampleKey}-namespaces`
			);

			senseExample["textVals"] = [];
			let exampleTextTmd = assignTMD(fieldsToUpdate, exampleKey, "text");
			senseExample["textVals"].push(exampleTextTmd);
			let exampleSourceIdentityTmd = assignTMD(
				fieldsToUpdate,
				exampleKey,
				"sourceIdentity"
			);
			if (
				exampleSourceIdentityTmd.inSelector ||
				exampleSourceIdentityTmd.constant
			) {
				senseExample["textVals"].push(exampleSourceIdentityTmd);
			}
			let exampleSourceElaborationTmd = assignTMD(
				fieldsToUpdate,
				exampleKey,
				"sourceElaboration"
			);
			if (
				exampleSourceElaborationTmd.inSelector ||
				exampleSourceElaborationTmd.constant
			) {
				senseExample["textVals"].push(exampleSourceElaborationTmd);
			}
			senseExample["outElement"] = "example";

			senseExample["children"] = [];

			let uniqueSenseExampleLabels = countOccurrences(
				`${exampleKey}-label`,
				fieldsToUpdate
			);

			uniqueSenseExampleLabels.forEach((labelKey) => {
				let senseExampleLabel = {};
				assignIfNotEmpty(
					fieldsToUpdate,
					senseExampleLabel,
					`${labelKey}-inSelector`
				);
				assignIfNotEmpty(
					fieldsToUpdate,
					senseExampleLabel,
					`${labelKey}-namespaces`
				);

				senseExampleLabel["textVals"] = [];
				let senseExampleLabelTmd = assignTMD(fieldsToUpdate, labelKey, "tag");
				senseExampleLabel["textVals"].push(senseExampleLabelTmd);

				senseExampleLabel["outElement"] = "label";

				if (senseExampleLabel.inSelector) {
					senseExample["children"].push(senseExampleLabel);
				}
			});

			if (senseExample.inSelector) {
				emd["children"].push(senseExample);
			}
		});

		emd["outElement"] = outElement;
		if (emd.inSelector) {
			// what about constant?
			newTransformation["children"].push(emd);
		}
	});
}

export function generateNewTransformation(
	fieldsToUpdate: { [key: string]: any },
	entrySelector: string,
	lexicographicResourceSelector: string,
	dictionaryTitle: string,
	dictionaryUri: string,
	dictionaryLanguage: string,
	xlat: { [key: string]: any },
	controlledValues: { [key: string]: any }
) {
	//let fieldsToUpdate: { [key: string]: any } = Object.fromEntries(formData);
	console.log("fieldsToUpdate", fieldsToUpdate);

	// generate entry
	let newTransformation = {};
	newTransformation["inSelector"] = entrySelector;
	newTransformation["outElement"] = "entry";
	newTransformation["textVals"] = [];

	let headword = {};
	assignIfNotEmpty(fieldsToUpdate, headword, "entry0-headword-inSelector");
	assignIfNotEmpty(fieldsToUpdate, headword, "entry0-headword-namespaces");
	assignIfNotEmpty(fieldsToUpdate, headword, "entry0-headword-attribute");
	assignIfNotEmpty(fieldsToUpdate, headword, "entry0-headword-regex");
	assignIfNotEmpty(fieldsToUpdate, headword, "entry0-headword-regexGroup");
	assignIfNotEmpty(fieldsToUpdate, headword, "entry0-headword-constant");
	headword["outElement"] = "headword";
	newTransformation["textVals"].push(headword);

	let id = {
		attribute: "{http://elex.is/wp1/teiLex0Mapper/meta}autogenerated",
		outElement: "id",
	};
	newTransformation["textVals"].push(id);

	let homographNumber = {};
	assignIfNotEmpty(
		fieldsToUpdate,
		homographNumber,
		"entry0-homographNumber-inSelector"
	);
	assignIfNotEmpty(
		fieldsToUpdate,
		homographNumber,
		"entry0-homographNumber-namespaces"
	);
	assignIfNotEmpty(
		fieldsToUpdate,
		homographNumber,
		"entry0-homographNumber-attribute"
	);
	assignIfNotEmpty(
		fieldsToUpdate,
		homographNumber,
		"entry0-homographNumber-regex"
	);
	assignIfNotEmpty(
		fieldsToUpdate,
		homographNumber,
		"entry0-homographNumber-regexGroup"
	);
	homographNumber["outElement"] = "homographNumber";

	if (fieldsToUpdate["entry0-homographNumber-inSelector"] !== "") {
		newTransformation["textVals"].push(homographNumber);
	}

	newTransformation["children"] = [];

	assignEMD(fieldsToUpdate, "entry0-label", "label", newTransformation);

	assignEMD(
		fieldsToUpdate,
		"entry0-partOfSpeech",
		"partOfSpeech",
		newTransformation,
		xlat
	);
	assignPronunciation(
		fieldsToUpdate,
		"entry0-pronunciation",
		"pronunciation",
		newTransformation
	);

	assignInflectedForm(
		fieldsToUpdate,
		"entry0-inflectedForm",
		"inflectedForm",
		newTransformation
	);

	assignSense(fieldsToUpdate, "entry0-sense", "sense", newTransformation);

	// generate new transformation with lexicographicResource

	let fullNewTransformation = {
		inSelector: `/${lexicographicResourceSelector}`,
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
		children: [newTransformation],
		copyToOutElt: controlledValues,
	};

	console.log("newTransformation", fullNewTransformation);

	return fullNewTransformation;
}

export function generateDefaultTransformationName(dictName: string) {
	const now = new Date();
	const formattedDate =
		"" +
		now.getFullYear() +
		(now.getMonth() + 1).toString().padStart(2, "0") +
		now.getDate().toString().padStart(2, "0") +
		now.getHours().toString().padStart(2, "0") +
		now.getMinutes().toString().padStart(2, "0") +
		now.getSeconds().toString().padStart(2, "0");

	return formattedDate + "_" + dictName;
}
