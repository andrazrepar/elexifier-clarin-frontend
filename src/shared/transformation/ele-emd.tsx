import { EleInputField } from "../elements/ele-input-field";
import { EleCollapsibleElement } from "../elements/ele-collapsible";
import React, { useState } from "react";
import { EleTMD } from "./ele-tmd";
import { findEMDs } from "./transformation-methods";

export const EleEMD: React.FC<any> = (props) => {
	const element = findEMDs(props.element, props.path);

	if (!element || element.length === 0) {
		const [fieldValues, setFieldValues] = useState({
			inSelector: "",
			namespaces: "",
			outElement: props.outElement || "",
		});

		const updateValues = (name: string, value: any) => {
			const newValues = [{ [name]: value, outElement: props.outElement }];
			props.updateValues(newValues);

			// Now you can use newValues object
		};

		const handleInputChange = (name: string, value: any) => {
			setFieldValues((prevValues) => ({ ...prevValues, [name]: value }));
			updateValues(name, value);
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
				{props.children}
			</EleCollapsibleElement>
		);
	} else {
		return (
			<>
				{props.element.map((element, index) => {
					const [fieldValues, setFieldValues] = useState({
						inSelector: element.inSelector || "",
						namespaces: element.namespaces || "",
						outElement: props.outElement || "",
					});

					const updateValues = (name: string, value: any) => {
						const newValues = [...props.element];
						newValues[index][name] = value;
						props.updateValues(newValues);
					};

					const handleInputChange = (name: string, value: any) => {
						setFieldValues((prevValues) => ({ ...prevValues, [name]: value }));
						updateValues(name, value);
					};

					return (
						<EleCollapsibleElement
							key={index}
							id={`${props.id}-${index}`}
							isExpanded={!!props.isExpanded[`${props.id}-${index}`]}
							handleExpand={props.handleExpand}
							label={props.outElement}
							className={props.className}
						>
							<EleInputField
								label="Path"
								name={`${props.id}-${index}-inSelector`}
								className="text-sm font-medium text-indigo-600"
								existingValue={fieldValues.inSelector}
								handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("inSelector", e.target.value)
								}
							/>

							<EleInputField
								label="Namespaces"
								name={`${props.id}-${index}-namespaces`}
								className="text-sm font-medium text-indigo-600"
								existingValue={fieldValues.namespaces}
								handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("namespaces", e.target.value)
								}
							/>
							<EleTMD
								id="entry-partOfSpeech-tag"
								isExpanded={props.isExpanded}
								handleExpand={props.handleExpand}
								className={props.tmdClassName}
								outElement="tag"
								element={props.element}
								updateValues={props.updateValues}
								index={index}
							/>
						</EleCollapsibleElement>
					);
				})}
			</>
		);
	}
};
