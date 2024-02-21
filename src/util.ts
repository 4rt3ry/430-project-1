enum hitLocation {
    body,
    back,
    head,
    occiput
}

/**
 * Calculate the damage per second of a weapon
 * @param damage damage per shot
 * @param rps rate per second
 * @returns 
 */
const calcDPS = (damage: number, rps: number): number => damage * rps;

/**
 * Calculate the precision damage for a weapon
 * @param damage damage per shot
 * @param multiplier precision multiplier
 * @returns 
 */
const calcPrecisionDamage = (damage: number, multiplier: number): number =>
    damage * multiplier;

export { hitLocation, calcDPS, calcPrecisionDamage }