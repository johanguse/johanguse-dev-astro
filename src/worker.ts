const CONTACT_RECIPIENT = "johanguse@gmail.com";
const CONTACT_SENDER = "contact@email.johanguse.dev";
const TURNSTILE_ACTION = "turnstile-spin-v1";

declare global {
	interface Env {
		TURNSTILE_SECRET_KEY: string;
	}
}

type TurnstileResult = {
	success: boolean;
	action?: string;
	"error-codes"?: string[];
};

type ContactPayload = {
	name: string;
	email: string;
	company: string;
	projectType: string;
	message: string;
	token: string;
};

const json = (body: Record<string, string>, init: ResponseInit = {}) =>
	Response.json(body, {
		...init,
		headers: {
			"cache-control": "no-store",
			...init.headers,
		},
	});

const escapeHtml = (value: string) =>
	value.replace(/[&<>'"]/g, (character) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"'": "&#39;",
			'"': "&quot;",
		};
		return entities[character] ?? character;
	});

const field = (formData: FormData, name: string, maxLength: number) => {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
};

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

async function parseContactPayload(
	request: Request,
): Promise<ContactPayload | null> {
	const contentType = request.headers.get("content-type") ?? "";
	if (
		!contentType.includes("multipart/form-data") &&
		!contentType.includes("application/x-www-form-urlencoded")
	) {
		return null;
	}

	const formData = await request.formData();
	return {
		name: field(formData, "name", 120),
		email: field(formData, "email", 254),
		company: field(formData, "company", 160),
		projectType: field(formData, "projectType", 80),
		message: field(formData, "message", 5_000),
		token: field(formData, "cf-turnstile-response", 2_048),
	};
}

async function verifyTurnstile(token: string, request: Request, env: Env) {
	const formData = new FormData();
	formData.set("secret", env.TURNSTILE_SECRET_KEY);
	formData.set("response", token);

	const remoteIp = request.headers.get("CF-Connecting-IP");
	if (remoteIp) formData.set("remoteip", remoteIp);

	const response = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			method: "POST",
			body: formData,
		},
	);

	if (!response.ok) return null;
	return (await response.json()) as TurnstileResult;
}

async function handleContact(request: Request, env: Env): Promise<Response> {
	if (request.method !== "POST") {
		return json(
			{ error: "Method not allowed." },
			{ status: 405, headers: { allow: "POST" } },
		);
	}

	const payload = await parseContactPayload(request);
	if (!payload)
		return json({ error: "Invalid form submission." }, { status: 400 });

	if (
		!payload.name ||
		!payload.email ||
		!payload.message ||
		!isEmail(payload.email)
	) {
		return json(
			{
				error:
					"Please provide your name, a valid email address, and a message.",
			},
			{ status: 400 },
		);
	}

	if (!payload.token) {
		return json(
			{
				error: "Please complete the verification before sending your message.",
			},
			{ status: 400 },
		);
	}

	let verification: TurnstileResult | null;
	try {
		verification = await verifyTurnstile(payload.token, request, env);
	} catch (error) {
		console.error("Turnstile verification request failed", error);
		return json(
			{ error: "Verification is temporarily unavailable. Please try again." },
			{ status: 503 },
		);
	}

	if (!verification?.success || verification.action !== TURNSTILE_ACTION) {
		console.warn(
			"Turnstile verification rejected",
			verification?.["error-codes"],
		);
		return json(
			{ error: "Verification failed. Please try again." },
			{ status: 400 },
		);
	}

	const subject = `New portfolio enquiry from ${payload.name}`;
	const text = [
		`Name: ${payload.name}`,
		`Email: ${payload.email}`,
		`Company: ${payload.company || "Not provided"}`,
		`Project type: ${payload.projectType || "Not provided"}`,
		"",
		"Message:",
		payload.message,
	].join("\n");
	const html = `
		<h1>New portfolio enquiry</h1>
		<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
		<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
		<p><strong>Company:</strong> ${escapeHtml(payload.company || "Not provided")}</p>
		<p><strong>Project type:</strong> ${escapeHtml(payload.projectType || "Not provided")}</p>
		<p><strong>Message:</strong></p>
		<p>${escapeHtml(payload.message).replace(/\n/g, "<br>")}</p>
	`;

	try {
		const emailResponse = await env.EMAIL.send({
			to: CONTACT_RECIPIENT,
			from: { email: CONTACT_SENDER, name: "Johan Guse" },
			replyTo: { email: payload.email, name: payload.name },
			subject,
			html,
			text,
		});
		console.info("Contact email accepted by Cloudflare", {
			messageId: emailResponse.messageId,
		});
	} catch (error) {
		const errorCode =
			typeof error === "object" &&
			error &&
			"code" in error &&
			typeof error.code === "string"
				? error.code
				: "UNKNOWN";
		const errorMessage =
			error instanceof Error ? error.message : "Unknown email sending error";
		console.error("Contact email failed to send", {
			code: errorCode,
			message: errorMessage,
		});
		return json(
			{
				error:
					"Your message could not be sent. Please try again or email Johan directly.",
			},
			{ status: 502 },
		);
	}

	return json({ message: "Thanks — your message is on its way." });
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/api/contact") return handleContact(request, env);
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
