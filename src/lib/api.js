/**
 * Mastercard Locations API Client
 *
 * Handles HTTP requests to the Mastercard Locations API
 */

import axios from 'axios';
import { getApiKey, getBaseUrl } from './config.js';

/**
 * Create an API client instance
 * @returns {Object} Axios instance configured for Mastercard Locations API
 */
export function createApiClient() {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();

  return axios.create({
    baseURL: baseUrl,
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: 30000,
  });
}

/**
 * Make a GET request
 * @param {string} path - API endpoint path
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response data
 */
export async function get(path, params = {}) {
  const client = createApiClient();
  const response = await client.get(path, { params });
  return response.data;
}

/**
 * Make a POST request
 * @param {string} path - API endpoint path
 * @param {Object} data - Request body
 * @returns {Promise<Object>} API response data
 */
export async function post(path, data = {}) {
  const client = createApiClient();
  const response = await client.post(path, data);
  return response.data;
}

/**
 * Make a PUT request
 * @param {string} path - API endpoint path
 * @param {Object} data - Request body
 * @returns {Promise<Object>} API response data
 */
export async function put(path, data = {}) {
  const client = createApiClient();
  const response = await client.put(path, data);
  return response.data;
}

/**
 * Make a DELETE request
 * @param {string} path - API endpoint path
 * @returns {Promise<Object>} API response data
 */
export async function del(path) {
  const client = createApiClient();
  const response = await client.delete(path);
  return response.data;
}
