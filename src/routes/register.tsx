import { Form, Link, useNavigate } from "react-router-dom";
import { EleButton } from "../shared/elements/ele-button";
import { EleInputField } from "../shared/elements/ele-input-field";
import { z, ZodError } from "zod";
import { useEffect, useState } from "react";
import eleApiService from "../shared/ele-api-service";

const hasLowercase = /[a-z]/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;
const hasSpecialCharacter = /[\W_]/;

const registerSchema = z
	.object({
		email: z.string().email(),
		password: z
			.string()
			.min(8, "Must be at least 8 characters")
			.refine((value) => hasLowercase.test(value), {
				message: "Missing a lowercase letter",
			})
			.refine((value) => hasUppercase.test(value), {
				message: "Missing an uppercase letter",
			})
			.refine((value) => hasNumber.test(value), {
				message: "Missing a number",
			})
			.refine((value) => hasSpecialCharacter.test(value), {
				message: "Missing a special character",
			}),
		repeatPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "Passwords must match",
		path: ["repeatPassword"],
	});

export default function RegisterPage() {
	const [errors, setErrors] = useState(null);
	const navigate = useNavigate();

	const onRegisterFormSubmit = async (e) => {
		e.preventDefault();

		const { email, password, repeatPassword } = e.target.elements;

		try {
			const parsedValues = registerSchema.parse({
				email: email?.value,
				password: password?.value,
				repeatPassword: repeatPassword?.value,
			});

			const registerResult = await eleApiService.register({
				email: parsedValues.email,
				password: parsedValues.password,
			});

			const resolvedRegisterResult = await registerResult.json();

			if (registerResult.status === 401) {
				return setErrors({
					email: ["Email already in use"],
				});
			}
			setErrors(null);
			return navigate("/login");
		} catch (error) {
			if (error instanceof ZodError) {
				const _errors = error.flatten().fieldErrors;
				setErrors(_errors);
			} else {
				setErrors({ generic: "Something went wrong" });
			}
		}
	};

	return (
		<div className="flex min-h-full flex-col justify-center lg:px-8">
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-gray-900">Signup</h1>
						<p className="mt-2 text-sm text-gray-700">
							Create a new account...
						</p>
					</div>
				</div>

				<div className="overflow-hidden bg-white shadow sm:rounded-md mt-4 p-4">
					<Form onSubmit={onRegisterFormSubmit}>
						<EleInputField
							id="email"
							name="email"
							label="Email:*"
							type="email"
							className="mb-4"
							errors={errors?.email}
						/>
						<EleInputField
							id="password"
							name="password"
							label="Password:*"
							type="password"
							className="mb-4"
							errors={errors?.password}
						/>
						<EleInputField
							id="repeatPassword"
							name="repeatPassword"
							label="Repeat password:*"
							type="password"
							className="mb-4"
							errors={errors?.repeatPassword}
						/>
						<EleButton type="submit" label="Register" value="register-form" />
					</Form>
				</div>

				<div className="mt-4 text-center">
					<p className="text-sm text-gray-700">
						Already have an account?{" "}
						<Link to="/login" className="text-sky-500 hover:text-sky-700">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
