import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Form } from "react-router-dom";
import { EleButton } from "./ele-button";
import { EleInputField } from "./ele-input-field";

export default function NewDictionaryModal(props) {
	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={props.setOpen}>
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

				<div className="fixed inset-0 z-10 overflow-y-auto">
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<Form onSubmit={props.handleSubmit}>
									<EleInputField name="entry" label="Entry" type="text" />
									<EleInputField name="headword" label="Headword" type="text" />
									<div className="mb-4">
										<label
											htmlFor="file"
											className="block text-gray-700 text-sm font-bold mb-2"
										>
											File:
										</label>
										<input
											id="file"
											name="file"
											type="file"
											required={true}
											onChange={props.handleFileChange}
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											accept=".xml"
										/>
									</div>
									<div className="flex justify-end space-x-4">
										<EleButton type="submit" label="Upload" value="create" />
										<EleButton
											type="button"
											label="Cancel"
											value="cancel"
											className="flex w-full justify-center rounded-md border border-indigo-600 bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											onClick={() => props.setOpen(false)}
										/>
									</div>
								</Form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
