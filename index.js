import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://akunlama.com/api/v1/mail';

/**
 * Check if a recipient name is available (inbox empty).
 * @param {string} recipient - name before @akunlama.com
 * @returns {Promise<{status: 'available', email: string} | {status: 'already taken', message: string}>}
 */
async function cekEmail(recipient) {
  const { data } = await axios.get(`${BASE_URL}/list?recipient=${recipient}`);
  if (Array.isArray(data) && data.length === 0) {
    return { status: 'available', email: `${recipient}@akunlama.com` };
  }
  return {
    status: 'already taken',
    message: 'coba yang lain lek, ini bisa sih tapi udh pernah di pake org',
  };
}

/**
 * List messages in an inbox.
 * @param {string} recipient - name before @akunlama.com
 * @returns {Promise<Array<{region, key, timestamp, sender, subject, from}>>}
 */
async function inbox(recipient) {
  const { data } = await axios.get(`${BASE_URL}/list?recipient=${recipient}`);
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map((item) => ({
    region: item.storage.region,
    key: item.storage.key,
    timestamp: item.timestamp,
    sender: item.sender,
    subject: item.message.headers.subject,
    from: item.message.headers.from,
  }));
}

/**
 * Read one message as plain text + links.
 * @param {string} region - storage region from inbox()
 * @param {string} key - storage key from inbox()
 * @returns {Promise<{plainText: string, links: Array<{href, text}>}>}
 */
async function getInbox(region, key) {
  const { data: html } = await axios.get(
    `${BASE_URL}/getHtml?region=${region}&key=${key}`
  );
  if (!html || typeof html !== 'string') return { plainText: '', links: [] };
  const $ = cheerio.load(html);
  $('script, style').remove();
  const plainText = $('body').text().replace(/\s+/g, ' ').trim();
  const links = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href) links.push({ href, text: $(el).text().trim() });
  });
  return { plainText, links };
}

export const akunlama = { cekEmail, inbox, getInbox };
export default akunlama;
