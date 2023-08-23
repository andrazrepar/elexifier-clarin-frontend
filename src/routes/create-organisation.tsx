import { Form, useLoaderData, useNavigate } from "react-router-dom";
import { EleInputField } from "../shared/client/ele-input-field";
import { EleButton } from "../shared/client/ele-button";
import { getToken } from "../shared/auth";
import { useState } from "react";
import { set, z, ZodError } from "zod";
import eleApiService from "../shared/ele-api-service";

const organisationSchema = z.object({
	name: z.string(),
});

export function CreateOrganisation() {
	const [errors, setErrors] = useState(null);
	const navigate = useNavigate();

	const onCreateOrganisationFormSubmit = async (e) => {
		e.preventDefault();

		const organisationName = e.target.elements.name.value;

		const parsedValues = organisationSchema.parse({
			name: organisationName,
		});

		try {
			const createOrganisationResult = await eleApiService.createOrganisation({
				name: parsedValues.name,
			});

			const resolvedCreateOrganisationResult =
				await createOrganisationResult.json();

			if (createOrganisationResult.status === 400) {
				console.log("here");
				return setErrors({
					name: [resolvedCreateOrganisationResult.message],
				});
			}

			setErrors(null);
			return navigate(
				`/app/organisation/${resolvedCreateOrganisationResult.id}/dictionaries`
			);
		} catch (error) {
			console.log(error);
			if (error instanceof ZodError) {
				const _errors = error.flatten().fieldErrors;
				setErrors(_errors);
			} else {
				setErrors({ generic: "Something went wrong" });
			}
		}
	};

	return (
		<div className="flex min-h-full flex-col justify-center sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-gray-900">
							Create organisation
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							Create a new organisation...
						</p>
					</div>
				</div>

				<div className="bg-white shadow sm:rounded-md mt-4 p-4">
					<Form method="post" onSubmit={onCreateOrganisationFormSubmit}>
						<EleInputField
							name="name"
							label="Name"
							type="text"
							errors={errors?.name}
						/>
						<EleButton type="submit" label="Create" value="create">
							Create
						</EleButton>
					</Form>
				</div>
			</div>
		</div>
	);
}
