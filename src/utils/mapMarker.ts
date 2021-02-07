import { convertToLatLon } from './position';
import { getColorFromPercentage } from './percentage';
import { staticIcons } from './icons';
import { getDistance } from './distance';

import { Radio } from '../interfaces/radio';

export const generateIconMarker = (
    radio: Radio,
    selectedRadio: Radio | undefined
): string => {
    const iconName = radio.Name
        ? staticIcons.get(`Type-${radio.Type}`)
        : 'alert-circle';

    const iconColor = getColorFromPercentage(
        (radio.BatteryLevel + radio.Strength * 10) / 2
    );

    // Create styles for rendered icon
    const iconStyles = radio.Name
        ? `background: ${iconColor}; box-shadow: 0px 0px 21px 0px ${iconColor};`
        : `background: purple; box-shadow: 0px 0px 21px 0px purple; color: white`;

    let html = `<span class='mdi mdi-${iconName} marker__icon' style='${iconStyles}'></span>`;

    if (selectedRadio && selectedRadio.Id !== radio.Id) {
        const selectedRadioPosition = convertToLatLon(selectedRadio.Position);
        const currentRadioPosition = convertToLatLon(radio.Position);

        const distanceInfo = `<span class="marker__distance">${getDistance(
            selectedRadioPosition,
            currentRadioPosition
        ).toString()}km</span>`;

        html = `
            ${distanceInfo}
            <span class='mdi mdi-${iconName} marker__icon' style='${iconStyles}'></span>
        `;
    } else if (selectedRadio && selectedRadio.Id === radio.Id) {
        html = `<span class='mdi mdi-${iconName} marker__icon marker__icon--selected'></span>`;
    }

    return html;
};
