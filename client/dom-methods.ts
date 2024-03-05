import { Comment, SingleStat, Stats } from "../interfaces";

/**
 * Table entry for a single weapon
 * @param fullName full name
 * @param name weapon name
 * @param thumbnail weapon thumbnail
 * @returns 
 */
const gtfoTableEntry = (
    fullName: any,
    name: any,
    thumbnail: any): HTMLDivElement => {

    thumbnail ||= 'https://placehold.it/300x300';
    const entry = document.createElement("div");
    entry.classList.add("column");
    entry.dataset.weaponId = name;
    entry.innerHTML = `
      <a href="#weapon-stats">
      <img class="thumbnail" src="${thumbnail}">
      <h5>${fullName}</h5>
      <p>${name}</p>
      </a>`;

    return entry;
}

/**
 * danger wrapper for li tags
 **/
const dangerLiWrapper = (content: any) =>
    `<li class="danger">${content}</li>`;

/**
* emphasis wrapper for li tags
**/
const emphasisLiWrapper = (content: any) =>
    `<li class="emphasize">${content}</li>`;

const liWrapper = (content: any) =>
    `<li>${content}</li>`;

const weaponStatsEntry = (
    weaponStats: SingleStat,
    enemyStats: Stats
) => {

    // numerical conversions
    const precisionMultiplier = Number(weaponStats.precision_multiplier) || 0;
    const damage = Number(weaponStats.damage) * Number(weaponStats.multishot ?? 0) || 0;
    const precisionDamage = precisionMultiplier * damage;
    const staggerMultiplier = Number(weaponStats.stagger_multiplier) || 0;
    const maxAmmo = Number(weaponStats.max_ammo) || 0;

    // emphasized stats
    let highPrecision = "";
    const isHighPrecision = precisionMultiplier >= 0.8;
    if (isHighPrecision)
        highPrecision = `<p class="emphasize">High Precision Multiplier</p>`;

    let highStagger = "";
    const isHighStagger = staggerMultiplier > 1.01
    if (isHighStagger)
        highStagger = `<p class="emphasize">High Stagger Multiplier</p>`;

    const dps = damage * Number(weaponStats.rps);


    // headshots effective against
    const effectivePrecision: string[] = [];
    const effectiveDamage: string[] = [];
    Object.values(enemyStats).forEach(enemy => {
        const multiplier = (enemy.multiplier as { [key: string]: number });
        const headshot = Number(multiplier.head) * precisionDamage || 0;
        const backshot = Number(multiplier.back) * precisionDamage || 0;
        const health = Number(enemy.health) || 0;
        const name = enemy.name.toString();
        const bigEnemy = health > 30.01;

        // CHECK PRECISION DAMAGE

        // scouts are special
        if (name.toLowerCase().includes('scout')) {
            if (headshot >= health) {
                effectivePrecision.push(emphasisLiWrapper(name));
            }
            else if (backshot >= health) {
                effectivePrecision.push(emphasisLiWrapper(name + " (back shot)"));
            }
        }
        // not a scout
        else {
            const isOverkill = damage >= health;
            const overkill = isOverkill ? " - overkill" : "";
            if (headshot >= health || backshot >= health) {
                if (isOverkill) effectivePrecision.push(dangerLiWrapper(name + overkill));
                else effectivePrecision.push(liWrapper(name));
            }
        }

        // CHECK NORMAL EFFECTIVENESS
        if (name.toLowerCase().includes("scout")) {
            if (damage >= health) {
                effectiveDamage.push(emphasisLiWrapper(name));
            }
        }
        else {
            if (damage >= health) {
                effectiveDamage.push(emphasisLiWrapper(name));
            }
            else if (!name.toLowerCase().includes("immortal")) {
                if (bigEnemy) {
                    if (damage * maxAmmo > 900) {
                        effectiveDamage.push(liWrapper(name));
                    }
                }
                else if (isHighStagger || isHighPrecision) {
                    effectiveDamage.push(liWrapper(name));
                }
            }
        }
    });

    // weapon is effective against


    const thumbnail = weaponStats.image.toString() || "https://placehold.it/300x300";

    const entry = document.createElement("div");
    entry.classList.add("orbit-slide-contents");
    entry.innerHTML = `
      <div class="weapon-stats-section">
              <img src="${thumbnail}">
              <h5>${weaponStats.full_name}</h5>
              <p>${weaponStats.name}</p>
            </div>
            <div class="weapon-stats-section">
              <table class="">
                <tbody>
                  <tr>
                    <th>Damage (per shot/burst)</th>
                    <td>${damage.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>DPS (damage per second)</th>
                    <td>${dps.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Max Ammo</th>
                    <td>${weaponStats.max_ammo}</td>
                  </tr>
                  <tr>
                    <th>Magazine Size</th>
                    <td>${weaponStats.magazine_size}</td>
                  </tr>
                  <tr>
                    <th>Fire Rate (rps)</th>
                    <td>${weaponStats.rps}</td>
                  </tr>
                  <tr>
                    <th>Most Effective Range</th>
                    <td>${weaponStats.falloff_start} meters</td>
                  </tr>
                </tbody>
              </table>
              ${highPrecision}
              ${highStagger}
            </div>
  
            <div class="weapon-stats-section">
              <h5>Precision shots are effective against: </h5>
              <ul>
                ${effectivePrecision.join("")}
              </ul>
              <h5>Body shots are effective against: </h5>
              <ul>
              ${effectiveDamage.join("")}
              </ul>
            </div>
            <div class="weapon-description">
  
            </div>`;
    return entry;
}

const commentEntry = (comment: Comment) => {

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const date = new Date(comment.date).toLocaleDateString(undefined, dateOptions);

    const element = document.createElement("div");
    element.classList.add("row");
    element.innerHTML = `
    <div class="comment">
          <h5>${comment.author}</h5>
          <p>${comment.text}</p>
            <p>${date}</p>
        </div>
    `;
    return element;
}

export { gtfoTableEntry, dangerLiWrapper, liWrapper, emphasisLiWrapper, weaponStatsEntry, commentEntry }