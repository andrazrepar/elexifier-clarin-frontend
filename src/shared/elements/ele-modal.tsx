import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { EleButton } from "./ele-button";
import { useSubmit, useFetcher } from "react-router-dom";

interface EleModalProps {
	isOpen: boolean;
	closeModal: () => void;
}

export default function EleModal({
	isOpen,
	closeModal,
	...props
}: EleModalProps) {
	const cancelButtonRef = useRef(null);
	let submit = useSubmit();

	function handleSubmit(intent: string) {
		return (e: React.MouseEvent) => {
			e.stopPropagation();
			const form = props.formRef.current;
			if (form) {
				// Create a new hidden input for "intent", set its value, and append it to the form
				const hiddenInput = document.createElement("input");
				hiddenInput.type = "hidden";
				hiddenInput.name = "intent";
				hiddenInput.value = intent;
				form.appendChild(hiddenInput);

				// Manually trigger form submission
				submit(form);

				// Remove the hidden input after form submission
				form.removeChild(hiddenInput);
			}
			closeModal();
		};
	}

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={cancelButtonRef}
				onClose={closeModal}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div>
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<CheckIcon
											className="h-6 w-6 text-green-600"
											aria-hidden="true"
										/>
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											Load Controlled Values
										</Dialog.Title>
										{props.taskInfo ? (
											props.taskInfo.status === "completed" ? (
												<p className="text-sm text-gray-500">
													A transformation has already been completed for this
													dictionary and you can immediately load controlled
													values. If you would like to transform the dictionary
													again, please select the "Transform" button and come
													back later.
												</p>
											) : (
												<p className="text-sm text-gray-500">
													A transformation is currently in progress. Please come
													back later.
												</p>
											)
										) : (
											<p className="text-sm text-gray-500">
												A transformation has not yet been completed. Click
												"Transform" and come back later.
											</p>
										)}
									</div>
								</div>
								{props.taskInfo ? (
									props.taskInfo.status === "completed" && (
										<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
											<EleButton
												type="submit"
												value="reload_controlled_values"
												label="Load"
												className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
												onClick={handleSubmit("reload_controlled_values")}
											></EleButton>
											<EleButton
												type="submit"
												value="transform"
												label="Transform"
												className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
												onClick={handleSubmit("transform")}
											></EleButton>
										</div>
									)
								) : (
									<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-1 sm:gap-3 justify-items-center">
										<EleButton
											type="submit"
											value="transform"
											label="Transform"
											className="mt-3 inline-flex justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
											onClick={handleSubmit("transform")}
										></EleButton>
									</div>
								)}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
