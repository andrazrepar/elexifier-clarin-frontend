import { getToken } from "./auth";
import { redirect } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { generateDefaultTransformation } from "./dmlex-spec";

interface RequestOptions {
	method: string;
	headers: Headers;
	redirect: string;
	body?: string;
}

class eleApiService {
	baseUrl: string;
	//token: string | null;

	constructor() {
		this.baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "";

		if (this.baseUrl === "") {
			throw new Error("BACKEND_BASE_URL is not set");
		}
	}

	redictToLogin() {
		return redirect("/login");
	}

	get token() {
		return getToken();
	}

	async login(body: object): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: "follow",
		};

		const response: Response = await fetch(
			`${this.baseUrl}/user/login`,
			requestOptions
		);

		return response;
	}

	async register(body: object): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: "follow",
		};

		const response: Response = await fetch(
			`${this.baseUrl}/user/register`,
			requestOptions
		);

		return response;
	}

	async makeRequest(url: string, options: RequestOptions): Promise<Response> {
		const response: Response = await fetch(`${this.baseUrl}${url}`, options);

		if (!this.token) {
			throw new Error("NoTokenError");
		}

		// If the response is 401 (Unauthorized), redirect to login.
		if (response.status === 401) {
			throw new Error("UnauthorizedError");
		} else {
			// Handle response here, e.g. convert to JSON, handle errors etc.
			return response;
		}
	}

	async listOrganisations(): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest("/organization", requestOptions);
	}

	async createOrganisation(body: object): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: "follow",
		};

		return await this.makeRequest("/organization", requestOptions);
	}

	async listDictionaries(): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(`/file`, requestOptions);
	}

	async createTask(body: object): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			redirect: "follow",
			body: JSON.stringify(body),
		};

		return await this.makeRequest(`/task`, requestOptions);
	}

	async uploadFile(selectedFile, entry, headword): Promise<object> {
		const chunkSize = 1024 * 1024; // chunk size 1MB
		const totalChunks = Math.ceil(selectedFile.size / chunkSize);
		const fileUuid = uuidv4();

		for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
			const start = chunkIndex * chunkSize;
			const end = Math.min(selectedFile.size, (chunkIndex + 1) * chunkSize);
			const chunk = selectedFile.slice(start, end);
			const formData = new FormData();

			formData.append("dzuuid", fileUuid);
			formData.append("dzchunkindex", chunkIndex);
			formData.append("dzchunkbyteoffset", start);
			formData.append("dztotalchunkcount", totalChunks);
			formData.append("dztotalfilesize", selectedFile.size);
			formData.append("file", chunk);
			formData.append("original_filename", selectedFile.name);
			formData.append("entry", entry);
			formData.append("lemma", headword);

			const myHeaders = new Headers();
			myHeaders.append("Authorization", this.token || "");

			const requestOptions: RequestOptions = {
				method: "POST",
				headers: myHeaders,
				body: formData,
				redirect: "follow",
			};

			const response: Response = await this.makeRequest(
				"/file",
				requestOptions
			);

			// Here you can handle the response, e.g. check for any errors, parse the JSON, etc.
			if (!response.ok) {
				throw new Error(
					`Upload chunk ${chunkIndex} failed! status: ${response.status}`
				);
			}
			const resData = await response.json();

			if (resData.message === "File upload successful") {
				return {
					success: true,
					message: "File upload successful",
					file_id: resData.file_id,
				};
			}
		}

		return { success: false, message: "File upload failed" };
	}

	async deleteFile(dictionaryId: string): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "DELETE",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(`/file/${dictionaryId}`, requestOptions);
	}

	async listEntries(
		dictionaryId: string,
		limit?: number,
		q?: string
	): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		// Start constructing the url with the path only
		const url = `/file/${dictionaryId}/entry`;

		const params = new URLSearchParams();

		// If limit is provided, add it to the url
		if (limit !== undefined) {
			params.append("limit", limit.toString());
		}

		// If q is provided, add it to the url
		if (q !== undefined) {
			params.append("q", q);
		}

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(
			url + "?" + params.toString(),
			requestOptions
		);
	}

	async getEntry(dictionaryId: string, entryId: string): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const url = `/file/${dictionaryId}/entry/${entryId}`;

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(url, requestOptions);
	}

	async getDictionary(dictionaryId: string): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const url = `/file/${dictionaryId}`;

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(url, requestOptions);
	}

	async updateDictionary(
		dictionaryId: String,
		entry: string,
		lemma: string,
		dictionaryMetadata: object
	): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const body = {
			entry: entry,
			lemma: lemma,
			dictionary_metadata: dictionaryMetadata,
		};

		const url = `/file/${dictionaryId}`;

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: "follow",
		};

		return await this.makeRequest(url, requestOptions);
	}

	async createTransformation(
		entry: string,
		lemma: string,
		lexicographicResource: string,
		name: string,
		dictionaryId: Number,
		dictionaryTitle: string,
		dictionaryUri: string,
		dictionaryLanguage: string
	): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const body = generateDefaultTransformation(
			entry,
			lemma,
			lexicographicResource,
			name,
			dictionaryId,
			dictionaryTitle,
			dictionaryUri,
			dictionaryLanguage
		);

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: "follow",
		};

		return await this.makeRequest(`/transformation`, requestOptions);
	}

	async applyTransformation(
		trnasformationId: Number,
		entryId: Number
	): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const url = `/transformation/${trnasformationId}/apply/${entryId}`;

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(url, requestOptions);
	}

	async getTransformation(transformationId: String): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const url = `/transformation/${transformationId}`;

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(url, requestOptions);
	}

	async resetTransformation(
		transformationId: String,
		entry: string,
		lemma: string,
		lexicographicResource: string,
		name: string,
		dictionaryId: Number,
		dictionaryTitle: string,
		dictionaryUri: string,
		dictionaryLanguage: string
	): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const body = generateDefaultTransformation(
			entry,
			lemma,
			lexicographicResource,
			name,
			dictionaryId,
			dictionaryTitle,
			dictionaryUri,
			dictionaryLanguage
		);

		const url = `/transformation/${transformationId}`;

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: "follow",
		};

		return await this.makeRequest(url, requestOptions);
	}

	async updateTransformation(
		transformationId: String,
		entry: string,
		lemma: string,
		name: string,
		transformation: object,
		advancedMode: boolean
	): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const body = {
			name: name,
			entry: entry,
			lemma: lemma,
			transformation: transformation,
			advanced_mode: advancedMode,
		};

		const url = `/transformation/${transformationId}`;

		const requestOptions: RequestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: "follow",
		};

		return await this.makeRequest(url, requestOptions);
	}

	async listTasks(): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(`/task`, requestOptions);
	}

	async getDmEntry(entryId: string): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(`/dmlex/entry/${entryId}`, requestOptions);
	}

	async getEntryPaths(fileId: string, entryId: string): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(
			`/file/${fileId}/entry/${entryId}/paths`,
			requestOptions
		);
	}

	async getPosElements(
		fileId: string,
		posElement: string,
		attributeName?: string
	): Promise<Response> {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", this.token || "");
		myHeaders.append("Content-Type", "application/json");

		const params = new URLSearchParams();
		params.append("pos_element", posElement);
		if (attributeName) {
			params.append("attribute_name", attributeName);
		}

		const requestOptions: RequestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		return await this.makeRequest(
			`/file/${fileId}/pos?${params.toString()}`,
			requestOptions
		);
	}

	// You can add more methods for other API calls here, all using makeRequest
}

export default new eleApiService();
