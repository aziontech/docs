/**
 * Segment Analytics Tracker for Azion Docs
 * 
 * This module provides server-side tracking via Segment proxy to avoid ad-blockers.
 * Implements:
 * - Anonymous ID management (cookie shared with Console on .azion.com domain)
 * - Session ID and first_session_url tracking (following Google's session definition)
 * - User ID validation
 * - Page, track, and identify calls
 */

import { SEGMENT_PROXY_URL, SEGMENT_WRITE_KEY } from '../consts';

// Cookie configuration for cross-domain sharing with Console
const COOKIE_DOMAIN = '.azion.com';
const ANONYMOUS_ID_COOKIE_NAME = 'ajs_anonymous_id';
const SESSION_ID_COOKIE_NAME = 'ajs_session_id';
const FIRST_SESSION_URL_COOKIE_NAME = 'ajs_first_session_url';
const USER_ID_COOKIE_NAME = 'ajs_user_id';

// Session timeout in milliseconds (30 minutes - following Google Analytics)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Validates if a userId is valid according to Segment best practices
 * - Must not be an email
 * - Must not be undefined
 * - Must not start with 'anon_' (anonymous ID pattern)
 */
export function isValidUserId(userId: string | undefined | null): userId is string {
    if (!userId) return false;
    if (typeof userId !== 'string') return false;
    if (userId.trim() === '') return false;

    // Check if it's an email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(userId)) return false;

    // Check if it starts with 'anon_' (anonymous ID pattern)
    if (userId.startsWith('anon_')) return false;

    return true;
}

/**
 * Generates a cryptographically secure random string
 */
function secureRandomString(length: number = 13): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(36))
        .join('')
        .substring(0, length);
}

/**
 * Generates a unique ID with optional prefix using cryptographically secure random
 */
function generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const randomPart = secureRandomString(13);
    return prefix ? `${prefix}_${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
}

/**
 * Gets a cookie value by name
 */
function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }

    return undefined;
}

/**
 * Sets a cookie with domain and path for cross-subdomain sharing
 */
function setCookie(
    name: string,
    value: string,
    expiresDays: number = 365,
    domain: string = COOKIE_DOMAIN
): void {
    if (typeof document === 'undefined') return;

    const date = new Date();
    date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);

    const expires = `expires=${date.toUTCString()}`;
    const domainAttr = domain ? `domain=${domain}` : '';

    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax; ${domainAttr}`;
}

/**
 * Gets or creates anonymous ID
 * Uses a cookie shared with Console for cross-domain consistency
 */
export function getAnonymousId(): string {
    let anonymousId = getCookie(ANONYMOUS_ID_COOKIE_NAME);

    if (!anonymousId) {
        anonymousId = `anon_${generateId()}`;
        setCookie(ANONYMOUS_ID_COOKIE_NAME, anonymousId, 365); // 1 year expiry
    }

    // Remove quotes if present (Segment JS SDK adds quotes)
    if (anonymousId.startsWith('"') && anonymousId.endsWith('"')) {
        anonymousId = anonymousId.slice(1, -1);
    }

    return anonymousId;
}

/**
 * Gets or creates session ID following Google's session definition
 * A session expires after 30 minutes of inactivity
 */
export function getSessionId(): string {
    const existingSessionId = getCookie(SESSION_ID_COOKIE_NAME);
    const lastActivityStr = getCookie('ajs_session_last_activity');
    const now = Date.now();

    // Check if session is still valid
    if (existingSessionId && lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);

        if (!isNaN(lastActivity) && (now - lastActivity) < SESSION_TIMEOUT_MS) {
            // Session is still active, update last activity
            setCookie('ajs_session_last_activity', now.toString(), 1);
            return existingSessionId;
        }
    }

    // Create new session
    const newSessionId = generateId('sess');
    setCookie(SESSION_ID_COOKIE_NAME, newSessionId, 1);
    setCookie('ajs_session_last_activity', now.toString(), 1);

    return newSessionId;
}

/**
 * Gets or sets the first session URL
 * This is the first URL the user visited in the current session
 */
export function getFirstSessionUrl(): string {
    let firstSessionUrl = getCookie(FIRST_SESSION_URL_COOKIE_NAME);

    if (!firstSessionUrl && typeof window !== 'undefined') {
        firstSessionUrl = window.location.href;
        setCookie(FIRST_SESSION_URL_COOKIE_NAME, firstSessionUrl, 1);
    }

    return firstSessionUrl || '';
}

/**
 * Gets the user ID from cookie if authenticated
 * Returns undefined if not authenticated or invalid
 */
export function getUserId(): string | undefined {
    const userId = getCookie(USER_ID_COOKIE_NAME);

    if (isValidUserId(userId)) {
        // Remove quotes if present
        if (userId.startsWith('"') && userId.endsWith('"')) {
            return userId.slice(1, -1);
        }
        return userId;
    }

    return undefined;
}

/**
 * Sets the user ID in cookie (called when user authenticates)
 * Only sets if the userId is valid
 */
export function setUserId(userId: string): void {
    if (isValidUserId(userId)) {
        setCookie(USER_ID_COOKIE_NAME, userId, 365);
    }
}

/**
 * Clears the user ID from cookie (called on logout)
 */
export function clearUserId(): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${USER_ID_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${COOKIE_DOMAIN}`;
}

/**
 * Gets page context information
 */
function getPageContext() {
    if (typeof window === 'undefined') {
        return {
            url: '',
            title: '',
            path: '',
            referrer: ''
        };
    }

    return {
        url: window.location.href,
        title: document.title,
        path: window.location.pathname,
        referrer: document.referrer || ''
    };
}

/**
 * Segment event types
 */
export type SegmentEventType = 'page' | 'track' | 'identify';

export interface SegmentPagePayload {
    anonymousId: string;
    userId?: string;
    context: {
        ip?: string;
        userAgent?: string;
    };
    properties: {
        title: string;
        url: string;
        first_session_url: string;
    };
}

export interface SegmentTrackPayload {
    event: string;
    anonymousId: string;
    userId?: string;
    context: {
        ip?: string;
        userAgent?: string;
        page: {
            url: string;
            title: string;
            path: string;
            referrer: string;
        };
    };
    properties: Record<string, unknown>;
}

export interface SegmentIdentifyPayload {
    anonymousId: string;
    userId?: string;
    context: {
        ip?: string;
        userAgent?: string;
    };
    traits: Record<string, unknown>;
}

export type SegmentPayload =
    | { type: 'page'; data: SegmentPagePayload }
    | { type: 'track'; data: SegmentTrackPayload }
    | { type: 'identify'; data: SegmentIdentifyPayload };

/**
 * Sends an event to the Segment proxy server-side
 */
async function sendToSegmentProxy(events: SegmentPayload[]): Promise<boolean> {
    try {
        const response = await fetch(SEGMENT_PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                writeKey: SEGMENT_WRITE_KEY,
                events
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to send Segment event:', error);
        return false;
    }
}

/**
 * Sends a page call to Segment
 */
export async function trackPageView(): Promise<boolean> {
    const anonymousId = getAnonymousId();
    const userId = getUserId();
    const pageContext = getPageContext();
    const firstSessionUrl = getFirstSessionUrl();

    // Initialize session on page load
    getSessionId();

    const payload: SegmentPagePayload = {
        anonymousId,
        userId,
        context: {
            // IP and User-Agent will be added by the proxy
        },
        properties: {
            title: pageContext.title,
            url: pageContext.url,
            first_session_url: firstSessionUrl
        }
    };

    return sendToSegmentProxy([{ type: 'page', data: payload }]);
}

/**
 * Sends a track call for click events (CTA, header, footer, sidebar)
 */
export async function trackClick(
    location: 'cta' | 'header' | 'footer' | 'sidebar' | 'docs_navigation',
    targetOrProperties: string | { href?: string; target?: string; [key: string]: unknown }
): Promise<boolean> {
    const anonymousId = getAnonymousId();
    const userId = getUserId();
    const pageContext = getPageContext();
    const firstSessionUrl = getFirstSessionUrl();

    // Support both string target and object with additional properties
    const isObject = typeof targetOrProperties === 'object' && targetOrProperties !== null;
    const target = isObject ? (targetOrProperties.href || targetOrProperties.target || '') : targetOrProperties;
    const extraProperties = isObject ? targetOrProperties : {};

    const payload: SegmentTrackPayload = {
        event: 'click',
        anonymousId,
        userId,
        context: {
            page: {
                url: pageContext.url,
                title: pageContext.title,
                path: pageContext.path,
                referrer: pageContext.referrer
            }
        },
        properties: {
            location,
            target,
            first_session_url: firstSessionUrl,
            ...extraProperties
        }
    };

    return sendToSegmentProxy([{ type: 'track', data: payload }]);
}

/**
 * Sends a track call for form submit events
 */
export async function trackFormSubmit(
    action: string,
    formData: Record<string, unknown>
): Promise<boolean> {
    const anonymousId = getAnonymousId();
    const userId = getUserId();
    const pageContext = getPageContext();
    const firstSessionUrl = getFirstSessionUrl();

    const payload: SegmentTrackPayload = {
        event: 'form_submit',
        anonymousId,
        userId,
        context: {
            page: {
                url: pageContext.url,
                title: pageContext.title,
                path: pageContext.path,
                referrer: pageContext.referrer
            }
        },
        properties: {
            action,
            first_session_url: firstSessionUrl,
            ...formData
        }
    };

    return sendToSegmentProxy([{ type: 'track', data: payload }]);
}

/**
 * Sends an identify call with user traits from form data
 */
export async function identifyUser(
    traits: Record<string, unknown>
): Promise<boolean> {
    const anonymousId = getAnonymousId();
    const userId = getUserId();

    const payload: SegmentIdentifyPayload = {
        anonymousId,
        userId,
        context: {},
        traits
    };

    return sendToSegmentProxy([{ type: 'identify', data: payload }]);
}

/**
 * Combined form submit with identify (common pattern)
 * Sends both track and identify calls together
 */
export async function trackFormSubmitWithIdentify(
    action: string,
    formData: Record<string, unknown>
): Promise<boolean> {
    const anonymousId = getAnonymousId();
    const userId = getUserId();
    const pageContext = getPageContext();
    const firstSessionUrl = getFirstSessionUrl();

    const trackPayload: SegmentTrackPayload = {
        event: 'form_submit',
        anonymousId,
        userId,
        context: {
            page: {
                url: pageContext.url,
                title: pageContext.title,
                path: pageContext.path,
                referrer: pageContext.referrer
            }
        },
        properties: {
            action,
            first_session_url: firstSessionUrl,
            ...formData
        }
    };

    const identifyPayload: SegmentIdentifyPayload = {
        anonymousId,
        userId,
        context: {},
        traits: formData
    };

    return sendToSegmentProxy([
        { type: 'track', data: trackPayload },
        { type: 'identify', data: identifyPayload }
    ]);
}
