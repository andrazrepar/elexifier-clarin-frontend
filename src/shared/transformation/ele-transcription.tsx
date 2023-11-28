import { EleInputField } from "../elements/ele-input-field";
import { EleCollapsibleElement } from "../elements/ele-collapsible";
import React, { useState, useCallback } from "react";
import { EleTMD } from "./ele-tmd";
import { TMDClassName } from "../elements/ele-transformation-parameters";
import { EleButton } from "../elements/ele-button";

export const EleTranscription: React.FC<any> = (props) => {
	const [isChildExpanded, setIsChildExpanded] = useState<{
		[id: string]: boolean;
	}>({});

	const toggleChildElement = (e: React.MouseEvent, id: string) => {
		e.stopPropagation();

		// Toggle only the clicked child, do not collapse other children.
		setIsChildExpanded((prevState) => ({
			...prevState,
			[id]: !prevState[id],
		}));
	};

	const localPath = `${props.id}-${props.outElement}`;

	const handleAdd = useCallback(() => {
		props.setCount((prevCount) => ({
			...prevCount,
			[localPath]: (prevCount[localPath] || 0) + 1,
		}));
	}, [props.setCount, localPath]);

	const handleDelete = useCallback(() => {
		props.setCount((prevCount) => {
			if (prevCount[localPath] > 1) {
				return {
					...prevCount,
					[localPath]: prevCount[localPath] - 1,
				};
			} else {
				return prevCount;
			}
		});
	}, [props.setCount, localPath]);

	return (
		<>
			{Array.from({ length: props.count[localPath] }).map((_, index) => {
				let localPathIndex = `${props.id}-${props.outElement}${index}`;
				return (
					<EleCollapsibleElement
						key={index}
						id={`${props.id}-${props.outElement}-${index}`}
						isExpanded={
							!!props.isExpanded[`${props.id}-${props.outElement}-${index}`]
						}
						handleExpand={props.handleExpand}
						label={`${props.outElement} ${index + 1}`}
						className={props.className}
					>
						<EleInputField
							label="Path"
							name={`${localPathIndex}-inSelector`}
							className="text-sm font-medium text-indigo-600"
							existingValue={
								props.flatTransformation[`${localPathIndex}-inSelector`]
							}
						/>

						<EleInputField
							label="Namespaces"
							name={`${localPathIndex}-namespaces`}
							className="text-sm font-medium text-indigo-600"
							existingValue={
								props.flatTransformation[`${localPathIndex}-namespaces`]
							}
						/>
						<EleTMD
							id={`${localPathIndex}-text`}
							outElement="text"
							className={TMDClassName}
							isExpanded={isChildExpanded}
							handleExpand={toggleChildElement}
							flatTransformation={props.flatTransformation}
						/>
						<EleTMD
							id={`${localPathIndex}-scheme`}
							outElement="scheme"
							className={TMDClassName}
							isExpanded={isChildExpanded}
							handleExpand={toggleChildElement}
							flatTransformation={props.flatTransformation}
						/>
						<div className="flex justify-between w-12">
							{" "}
							{/* Adjust width as needed */}
							<EleButton
								label="+"
								value="add"
								onClick={handleAdd}
								disabled={false}
								className="w-full" // Make the button take the full width of its parent
							/>
							<EleButton
								label="-"
								value="delete"
								onClick={() => handleDelete(index)}
								disabled={props.count[localPath] === 1}
								className="w-full" // Make the button take the full width of its parent
							/>
						</div>
					</EleCollapsibleElement>
				);
			})}
		</>
	);
};
