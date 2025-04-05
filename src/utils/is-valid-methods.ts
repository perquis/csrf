export type HTTPMethod =
	| 'GET'
	| 'POST' 
	| 'PUT' 
	| 'DELETE' 
	| 'PATCH' 
	| 'OPTIONS' 
	| 'HEAD';

export const VALID_METHODS: HTTPMethod[] = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
];

/**
 * * Validates if the provided HTTP method is one of the standard methods.
 * @param method - The HTTP method to validate.
 */
export const isValidMethod = (method: HTTPMethod) => {
  return VALID_METHODS.includes(method);
};
