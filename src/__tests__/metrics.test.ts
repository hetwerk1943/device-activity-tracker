/**
 * Tests for shared metrics calculation utilities.
 * Run with: node --import tsx --test src/__tests__/metrics.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateMedian,
    calculateMovingAverage,
    addRttMeasurement,
    createDeviceMetrics,
    determineState,
    MAX_VALID_RTT,
    RECENT_RTT_COUNT,
    MAX_RTT_HISTORY,
    MIN_MEASUREMENTS_FOR_STATE,
    THRESHOLD_MULTIPLIER,
} from '../shared/metrics.js';

describe('calculateMedian', () => {
    it('returns 0 when fewer than MIN_MEASUREMENTS_FOR_STATE values', () => {
        assert.equal(calculateMedian([]), 0);
        assert.equal(calculateMedian([100]), 0);
        assert.equal(calculateMedian([100, 200]), 0);
    });

    it('returns correct median for odd number of values', () => {
        assert.equal(calculateMedian([100, 200, 300]), 200);
        assert.equal(calculateMedian([50, 100, 200, 300, 400]), 200);
    });

    it('returns correct median for even number of values', () => {
        assert.equal(calculateMedian([100, 200, 300, 400]), 250);
    });

    it('handles unsorted input correctly', () => {
        assert.equal(calculateMedian([300, 100, 200]), 200);
    });
});

describe('calculateMovingAverage', () => {
    it('returns 0 for empty array', () => {
        assert.equal(calculateMovingAverage([]), 0);
    });

    it('returns correct average', () => {
        assert.equal(calculateMovingAverage([100, 200, 300]), 200);
        assert.equal(calculateMovingAverage([1000]), 1000);
    });
});

describe('createDeviceMetrics', () => {
    it('creates metrics with default state', () => {
        const metrics = createDeviceMetrics(500);
        assert.equal(metrics.state, 'Calibrating...');
        assert.equal(metrics.lastRtt, 500);
        assert.deepEqual(metrics.rttHistory, []);
        assert.deepEqual(metrics.recentRtts, []);
    });

    it('creates metrics with custom state', () => {
        const metrics = createDeviceMetrics(10000, 'OFFLINE');
        assert.equal(metrics.state, 'OFFLINE');
        assert.equal(metrics.lastRtt, 10000);
    });
});

describe('addRttMeasurement', () => {
    it('adds valid RTT measurement', () => {
        const metrics = createDeviceMetrics(0);
        assert.equal(addRttMeasurement(metrics, 500), true);
        assert.deepEqual(metrics.recentRtts, [500]);
        assert.deepEqual(metrics.rttHistory, [500]);
        assert.equal(metrics.lastRtt, 500);
    });

    it('rejects RTT above MAX_VALID_RTT', () => {
        const metrics = createDeviceMetrics(0);
        assert.equal(addRttMeasurement(metrics, MAX_VALID_RTT + 1), false);
        assert.deepEqual(metrics.recentRtts, []);
    });

    it('caps recent RTTs at RECENT_RTT_COUNT', () => {
        const metrics = createDeviceMetrics(0);
        for (let i = 0; i < RECENT_RTT_COUNT + 2; i++) {
            addRttMeasurement(metrics, 100 + i);
        }
        assert.equal(metrics.recentRtts.length, RECENT_RTT_COUNT);
    });

    it('caps history at MAX_RTT_HISTORY', () => {
        const metrics = createDeviceMetrics(0);
        for (let i = 0; i < MAX_RTT_HISTORY + 10; i++) {
            addRttMeasurement(metrics, 100);
        }
        assert.equal(metrics.rttHistory.length, MAX_RTT_HISTORY);
    });
});

describe('determineState', () => {
    it('returns Calibrating when insufficient history', () => {
        assert.equal(determineState(100, [100, 200]), 'Calibrating...');
        assert.equal(determineState(100, []), 'Calibrating...');
    });

    it('returns Online when moving avg is below threshold', () => {
        // Median of [100, 200, 300] = 200, threshold = 200 * 0.9 = 180
        // Moving avg 100 < 180 → Online
        assert.equal(determineState(100, [100, 200, 300]), 'Online');
    });

    it('returns Standby when moving avg is above threshold', () => {
        // Median of [100, 200, 300] = 200, threshold = 200 * 0.9 = 180
        // Moving avg 250 >= 180 → Standby
        assert.equal(determineState(250, [100, 200, 300]), 'Standby');
    });

    it('returns Standby when moving avg equals threshold', () => {
        // Median of [100, 200, 300] = 200, threshold = 180
        // Moving avg 180 >= 180 → Standby
        assert.equal(determineState(180, [100, 200, 300]), 'Standby');
    });
});
