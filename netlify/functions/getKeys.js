/**
 * Netlify serverless function to retrieve the API key from environment variables.
 *
 * @param {Object} event - Netlify event object (unused)
 * @param {Object} context - Netlify context object (unused)
 * @returns {Promise<{statusCode: number, body: string}>} Response object with API key in JSON format
 *
 * @example
 * // Netlify will call this function automatically
 * // Response: { statusCode: 200, body: '{"apiKey":"your-key"}' }
 */
// eslint-disable-next-line
export async function handler(event, context) {
  const apiKey = process.env.api_key;
  return {
    statusCode: 200,
    body: JSON.stringify({ apiKey }),
  };
}
