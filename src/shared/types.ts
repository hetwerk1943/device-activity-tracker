/**
 * Shared types for activity tracking across platforms.
 */

/**
 * Probe method types
 * - 'delete': Silent delete probe (sends delete request for non-existent message) - DEFAULT
 * - 'reaction': Reaction probe (sends reaction to non-existent message)
 */
export type ProbeMethod = 'delete' | 'reaction';

/**
 * Platform type for contacts
 */
export type Platform = 'whatsapp' | 'signal';

/**
 * Metrics tracked per device for activity monitoring
 */
export interface DeviceMetrics {
    rttHistory: number[];      // Historical RTT measurements (up to 2000)
    recentRtts: number[];      // Recent RTTs for moving average (last 3)
    state: string;             // Current device state (Online/Standby/Calibrating/Offline)
    lastRtt: number;           // Most recent RTT measurement
    lastUpdate: number;        // Timestamp of last update
}

/**
 * Device info for tracker updates
 */
export interface DeviceInfo {
    jid: string;
    state: string;
    rtt: number;
    avg: number;
}

/**
 * Tracker update data emitted to clients
 */
export interface TrackerUpdateData {
    devices: DeviceInfo[];
    deviceCount: number;
    presence: string | null;
    median: number;
    threshold: number;
}
