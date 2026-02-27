/**
 * Shared metrics calculation utilities for activity tracking.
 * Used by both WhatsApp and Signal trackers to avoid code duplication.
 */

import { DeviceMetrics } from './types.js';

/** Maximum RTT value to consider valid (not a timeout) */
export const MAX_VALID_RTT = 5000;

/** Maximum history length for RTT measurements */
export const MAX_RTT_HISTORY = 2000;

/** Number of recent RTTs for moving average */
export const RECENT_RTT_COUNT = 3;

/** Threshold multiplier applied to median for state determination */
export const THRESHOLD_MULTIPLIER = 0.9;

/** Minimum measurements required before state determination */
export const MIN_MEASUREMENTS_FOR_STATE = 3;

/**
 * Calculate median from an array of numbers.
 * Returns 0 if fewer than MIN_MEASUREMENTS_FOR_STATE values.
 */
export function calculateMedian(values: number[]): number {
    if (values.length < MIN_MEASUREMENTS_FOR_STATE) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate moving average from recent RTT measurements.
 */
export function calculateMovingAverage(recentRtts: number[]): number {
    if (recentRtts.length === 0) return 0;
    return recentRtts.reduce((a, b) => a + b, 0) / recentRtts.length;
}

/**
 * Create initial device metrics for a new device.
 */
export function createDeviceMetrics(initialRtt: number, initialState: string = 'Calibrating...'): DeviceMetrics {
    return {
        rttHistory: [],
        recentRtts: [],
        state: initialState,
        lastRtt: initialRtt,
        lastUpdate: Date.now()
    };
}

/**
 * Add an RTT measurement to device metrics (mutates metrics in place).
 * Returns true if measurement was added (valid RTT), false otherwise.
 */
export function addRttMeasurement(metrics: DeviceMetrics, rtt: number): boolean {
    if (rtt > MAX_VALID_RTT) return false;

    metrics.recentRtts.push(rtt);
    if (metrics.recentRtts.length > RECENT_RTT_COUNT) {
        metrics.recentRtts.shift();
    }

    metrics.rttHistory.push(rtt);
    if (metrics.rttHistory.length > MAX_RTT_HISTORY) {
        metrics.rttHistory.shift();
    }

    metrics.lastRtt = rtt;
    metrics.lastUpdate = Date.now();
    return true;
}

/**
 * Determine device state based on RTT analysis.
 * Returns the new state string.
 */
export function determineState(
    movingAvg: number,
    globalRttHistory: number[]
): string {
    if (globalRttHistory.length < MIN_MEASUREMENTS_FOR_STATE) {
        return 'Calibrating...';
    }

    const median = calculateMedian(globalRttHistory);
    const threshold = median * THRESHOLD_MULTIPLIER;

    return movingAvg < threshold ? 'Online' : 'Standby';
}
