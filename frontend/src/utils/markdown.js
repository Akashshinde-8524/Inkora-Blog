import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked with standard GFM options
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
});

/**
 * Parses markdown into safe, sanitized HTML
 * @param {string} markdown 
 * @returns {string} Sanitized HTML
 */
export function renderMarkdown(markdown) {
  if (!markdown) return '';
  const rawHtml = marked.parse(markdown);
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel'],
  });
}

/**
 * Calculates estimated reading time in minutes
 * @param {string} content 
 * @returns {number}
 */
export function calculateReadingTime(content) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Strips markdown symbols for generating excerpts
 * @param {string} content 
 * @param {number} maxLength 
 * @returns {string}
 */
export function stripMarkdown(content, maxLength = 160) {
  if (!content) return '';
  const plain = content
    .replace(/[#*`_~[\]()>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLength ? plain.substring(0, maxLength - 3) + '...' : plain;
}
