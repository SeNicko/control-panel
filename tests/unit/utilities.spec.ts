import { getColorFromPercentage } from '@/utils/percentage';
import { getBatteryIcon, getSignalIcon } from '@/utils/icons';
import { getDistance } from '@/utils/distance';

interface PercentageTestEntry {
    entry: number;
    result: string;
}

interface BatteryTestEntry {
    entry: number;
    result: string;
}

// Test util functions
describe('utilities functions', () => {
    // Test getting color from percentage
    it('properly gets color from percentage', () => {
        const percentages: PercentageTestEntry[] = [
            {
                entry: 76,
                result: 'hsl(76, 100%, 50%)',
            },
            {
                entry: -10,
                result: 'hsl(0, 100%, 50%)',
            },
            {
                entry: 120,
                result: 'hsl(100, 100%, 50%)',
            },
        ];

        percentages.forEach(({ entry, result }: PercentageTestEntry) => {
            expect(getColorFromPercentage(entry)).toBe(result);
        });
    });

    it('properly gets battery icon', () => {
        const batteryLevel: BatteryTestEntry[] = [
            {
                entry: 80,
                result: 'battery-80',
            },
            {
                entry: -10,
                result: 'battery-outline',
            },
            {
                entry: 100,
                result: 'battery',
            },
            {
                entry: 170,
                result: 'battery',
            },
        ];

        batteryLevel.forEach(({ entry, result }: PercentageTestEntry) => {
            expect(getBatteryIcon(entry)).toBe(result);
        });
    });

    it('properly gets signal icon', () => {
        const batteryLevel: BatteryTestEntry[] = [
            {
                entry: 10,
                result: 'network-strength-4',
            },
            {
                entry: 5,
                result: 'network-strength-2',
            },
        ];

        batteryLevel.forEach(({ entry, result }: PercentageTestEntry) => {
            console.log(entry);
            expect(getSignalIcon(entry)).toBe(result);
        });
    });

    it('properly calculates distance between two cordinates', () => {
        expect(
            getDistance([59.3293371, 13.4877472], [59.3225525, 13.4619422])
        ).toBe(1.6);
    });
});
