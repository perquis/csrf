declare global {
	namespace Express {
		interface Request {
			csrf: string;
		}
	}
}

export {};
