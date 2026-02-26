import React, { useEffect } from 'react';
import { ADS_ENABLED, ADS_CLIENT } from '../adsConfig';

interface AdBannerProps {
    /** AdSense ad slot ID. Replace with your real slot ID before going live. */
    slot: string;
    /** Optional extra CSS classes for the wrapper element. */
    className?: string;
}

/**
 * Responsive SAFE AdSense banner.
 *
 * Renders nothing when ADS_ENABLED is false or when the publisher ID is still
 * the placeholder value, preventing accidental ad calls during development.
 */
export function AdBanner({ slot, className = '' }: AdBannerProps) {
    const isPlaceholder =
        ADS_CLIENT === 'ca-pub-XXXXXXXXXXXXXXXX' || slot === 'XXXXXXXXXX';

    useEffect(() => {
        if (!ADS_ENABLED || isPlaceholder) return;
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch {
            // adsbygoogle not yet loaded – safe to ignore
        }
    }, [isPlaceholder]);

    if (!ADS_ENABLED) return null;

    if (isPlaceholder) {
        return (
            <div
                className={`w-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg text-gray-400 text-xs py-3 ${className}`}
                aria-hidden="true"
            >
                Ad placeholder – configure AdSense publisher &amp; slot IDs to activate
            </div>
        );
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ADS_CLIENT}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
