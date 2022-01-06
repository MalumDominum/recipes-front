export default async function sendRequest(credentials, url, httpMethod) {
	return fetch(url, {
		method: httpMethod,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Credentials": true,
			accept: "text/plain",
		},
		body: credentials ? JSON.stringify(credentials) : null,
		credentials: "include",
	}).then(async (response) => {
		if (response.ok) {
			const text = await response.text();
			return text === "" ? null : JSON.parse(text);
		}
		throw new Error(await response.text());
	});
}
