import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { EleChildElement } from "./ele-child-element";
import { EleTextValElement } from "./ele-textval-element";
import JsonResult from "./ele-json-result";

export function TransformTree2(entry: Object) {
	const [isSubElementExpanded, setIsSubElementExpanded] = useState({});

	const toggleSubElement = (id: string) => {
		setIsSubElementExpanded({
			...isSubElementExpanded,
			[id]: !isSubElementExpanded[id],
		});
	};

	return (
		<div className="my-4 bg-white ">
			<EleTextValElement
				id="entry-headword"
				isSubElementExpanded={isSubElementExpanded}
				handleExpand={toggleSubElement}
				outElement="headword"
				attribute={true}
				namespaces={false}
				regex={true}
				regexGroup={true}
				xlat={false}
				markers={false}
			/>
			<JsonResult result={entry.entry.headword} />
			<hr className="pb-2" />
			<EleTextValElement
				id="entry-homographNumber"
				isSubElementExpanded={isSubElementExpanded}
				handleExpand={toggleSubElement}
				outElement="homographNumber"
				attribute={true}
				namespaces={false}
				regex={true}
				regexGroup={true}
				xlat={false}
				markers={false}
			/>
			<JsonResult result={entry.entry.homographNumber} />
			<hr className="pb-2" />
			<EleChildElement
				id="entry-partOfSpeech"
				isSubElementExpanded={isSubElementExpanded}
				handleExpand={toggleSubElement}
				outElement="partOfSpeech"
				dvalue="test-value"
			>
				<EleTextValElement
					id="entry-partOfSpeech-value"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="value"
					inSelector={false}
					attribute={true}
					namespaces={false}
					regex={true}
					regexGroup={true}
					xlat={true}
					markers={false}
				/>
			</EleChildElement>
			<JsonResult result={entry.entry.partOfSpeech} />
			<hr className="pb-2" />
			<EleChildElement
				id="entry-label"
				isSubElementExpanded={isSubElementExpanded}
				handleExpand={toggleSubElement}
				outElement="label"
			>
				<EleTextValElement
					id="entry-label-value"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="value"
					attribute={true}
					namespaces={false}
					regex={true}
					regexGroup={true}
					xlat={false}
					markers={false}
				/>
			</EleChildElement>
			<JsonResult result={entry.entry.label} />
			<hr className="pb-2" />
			<EleChildElement
				id="entry-pronounciation"
				isSubElementExpanded={isSubElementExpanded}
				handleExpand={toggleSubElement}
				outElement="pronounciation"
			>
				<EleTextValElement
					id="entry-pronounciation-soundFile"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="soundFile"
					attribute={true}
					namespaces={false}
					regex={true}
					regexGroup={true}
					xlat={false}
					markers={false}
				/>
				<EleChildElement
					id="entry-pronounciation-label"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="label"
				>
					<EleTextValElement
						id="entry-pronounciation-label-value"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="value"
					/>
				</EleChildElement>
				<EleChildElement
					id="entry-pronounciation-transcription"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="transcription"
				>
					<EleTextValElement
						id="entry-pronounciation-transcription-text"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="text"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
					<EleTextValElement
						id="entry-pronounciation-transcription-scheme"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="scheme"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
				</EleChildElement>
			</EleChildElement>
			<JsonResult result={entry.entry.pronounciation} />
			<hr className="pb-2" />
			<EleChildElement
				id="entry-inflectedForm"
				isSubElementExpanded={isSubElementExpanded}
				handleExpand={toggleSubElement}
				outElement="inflectedForm"
			>
				<EleTextValElement
					id="entry-inflectedForm-text"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="text"
					attribute={true}
					namespaces={false}
					regex={true}
					regexGroup={true}
					xlat={false}
					markers={false}
				/>
				<EleChildElement
					id="entry-inflectedForm-label"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="label"
				>
					<EleTextValElement
						id="entry-inflectedForm-label-value"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="value"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
				</EleChildElement>
				<EleChildElement
					id="entry-inflectedForm-pronounciation"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="pronounciation"
				>
					<EleTextValElement
						id="entry-inflectedForm-pronounciation-soundFile"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="soundFile"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
					<EleChildElement
						id="entry-inflectedForm-pronounciation-label"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="label"
					>
						<EleTextValElement
							id="entry-inflectedForm-pronounciation-label-value"
							isSubElementExpanded={isSubElementExpanded}
							handleExpand={toggleSubElement}
							outElement="value"
							attribute={true}
							namespaces={false}
							regex={true}
							regexGroup={true}
							xlat={false}
							markers={false}
						/>
					</EleChildElement>
					<EleChildElement
						id="entry-inflectedForm-pronounciation-transcription"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="transcription"
					>
						<EleTextValElement
							id="entry-inflectedForm-pronounciation-transcription-text"
							isSubElementExpanded={isSubElementExpanded}
							handleExpand={toggleSubElement}
							outElement="text"
							attribute={true}
							namespaces={false}
							regex={true}
							regexGroup={true}
							xlat={false}
							markers={false}
						/>
						<EleTextValElement
							id="entry-inflectedForm-pronounciation-transcription-scheme"
							isSubElementExpanded={isSubElementExpanded}
							handleExpand={toggleSubElement}
							outElement="scheme"
							attribute={true}
							namespaces={false}
							regex={true}
							regexGroup={true}
							xlat={false}
							markers={false}
						/>
					</EleChildElement>
				</EleChildElement>
			</EleChildElement>
			<JsonResult result={entry.entry.inflectedForm} />
			<hr className="pb-2" />
			<EleChildElement
				id="entry-sense"
				isSubElementExpanded={isSubElementExpanded}
				handleExpand={toggleSubElement}
				outElement="sense"
			>
				<EleTextValElement
					id="entry-sense-indicator"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="indicator"
					attribute={true}
					namespaces={false}
					regex={true}
					regexGroup={true}
					xlat={false}
					markers={false}
				/>
				<EleChildElement
					id="entry-sense-label"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="label"
				>
					<EleTextValElement
						id="entry-sense-label-value"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="value"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
				</EleChildElement>
				<EleChildElement
					id="entry-sense-definition"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="definition"
				>
					<EleTextValElement
						id="entry-sense-definition-value"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="value"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
					<EleTextValElement
						id="entry-sense-definition-definitionType"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="definitionType"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
				</EleChildElement>
				<EleChildElement
					id="entry-sense-example"
					isSubElementExpanded={isSubElementExpanded}
					handleExpand={toggleSubElement}
					outElement="example"
				>
					<EleTextValElement
						id="entry-sense-example-text"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="text"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
					<EleTextValElement
						id="entry-sense-example-sourceIdentity"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="sourceIdentity"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
					<EleTextValElement
						id="entry-sense-example-sourceElaboration"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="sourceElaboration"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
					<EleTextValElement
						id="entry-sense-example-soundFile"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="soundFile"
						attribute={true}
						namespaces={false}
						regex={true}
						regexGroup={true}
						xlat={false}
						markers={false}
					/>
					<EleChildElement
						id="entry-sense-example-label"
						isSubElementExpanded={isSubElementExpanded}
						handleExpand={toggleSubElement}
						outElement="label"
					>
						<EleTextValElement
							id="entry-sense-example-label-value"
							isSubElementExpanded={isSubElementExpanded}
							handleExpand={toggleSubElement}
							outElement="value"
							attribute={true}
							namespaces={false}
							regex={true}
							regexGroup={true}
							xlat={false}
							markers={false}
						/>
					</EleChildElement>
				</EleChildElement>
			</EleChildElement>
			<JsonResult result={entry.entry.senses} />
		</div>
	);
}
