import axios, { AxiosResponse } from 'axios'
import { Comment, Stats, WeaponIndex } from '../interfaces';
import { weaponStatsEntry, gtfoTableEntry, commentEntry } from './dom-methods';

////
///////////////////////// DOM ELEMENTS //////////////////////////////
////
const mainWeaponsTable = document.querySelector("#main-weapons-table") as HTMLElement;
const specialWeaponsTable = document.querySelector("#special-weapons-table") as HTMLElement;
const weaponStatsSlide = document.querySelector("#weapon-stats") as HTMLElement;
const commentsSection = document.querySelector("#comments");
////
///////////////////////// Variables //////////////////////////////
////

// main page
let allWeapons: Stats = {};
const weaponIndices: WeaponIndex = {};
const mainWeaponStats: Stats = {};
const specialWeaponStats: Stats = {};
const enemyStats: Stats = {};
let currentWeaponId = "Pistol";
let currentWeaponIndex = 0;

// comments
let comments: Comment[] = [];

////
////////////////////////// HELPER METHODS ///////////////////////
////
const loadStats = (statsObject: Stats) => {
    return (response: AxiosResponse) => {
        const results = response.data["results"];
        Object.assign(statsObject, results);
    }
}

const nextStatClickHandler = () => {
    if (currentWeaponIndex === weaponIndices.length.value - 1) {
        currentWeaponIndex = 0;
    } else {
        currentWeaponIndex++;
    }
    currentWeaponId = Object.values(weaponIndices).find(i => i.name !== "length" && i.value === currentWeaponIndex)?.name || currentWeaponId;
    loadWeaponStatsSlide();
}

const prevStatClickHandler = () => {
    if (currentWeaponIndex === 0) {
        currentWeaponIndex = weaponIndices.length.value - 1;
    }
    else currentWeaponIndex--;

    currentWeaponId = Object.values(weaponIndices).find(i => i.name !== "length" && i.value === currentWeaponIndex)?.name || currentWeaponId;
    loadWeaponStatsSlide();
}


const weaponClickHandler = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    const weaponId = target.dataset.weaponId;
    if (weaponId) {
        if (weaponIndices[weaponId] !== undefined) {
            currentWeaponId = weaponId;
            currentWeaponIndex = weaponIndices[weaponId].value;
        }

    }
    loadWeaponStatsSlide();
}

const loadWeaponStatsSlide = () => {
    const currentWeaponStats = mainWeaponStats[currentWeaponId] || specialWeaponStats[currentWeaponId];
    weaponStatsSlide.innerHTML = "";
    weaponStatsSlide.appendChild(weaponStatsEntry(currentWeaponStats, enemyStats));
}

const loadWeaponsTable = (response: AxiosResponse) => {
    const weaponData = response.data.results as Stats;
    const mainWeapons: HTMLElement[] = [];
    const specialWeapons: HTMLElement[] = [];
    allWeapons = weaponData;
    Object.keys(allWeapons).forEach((w, i) => {
        weaponIndices[w] = {
            name: w,
            value: i
        };
    });
    weaponIndices.length = {
        value: Object.keys(allWeapons).length,
        name: "length"
    }

    // add each table entry in the main body of the webpage
    Object.values(weaponData).forEach(weapon => {
        const fullName = weapon["full_name"];
        const name = weapon["name"]
        const thumbnail = weapon["image"];
        const weaponHandler: { [key: string]: any } = {
            "main": () => mainWeapons.push(gtfoTableEntry(fullName, name, thumbnail)),
            "special": () => specialWeapons.push(gtfoTableEntry(fullName, name, thumbnail))
        }
        weaponHandler[weapon["type"].toString()]();
    });

    mainWeaponsTable.innerHTML = "";
    specialWeaponsTable.innerHTML = "";

    // Add click listeners to each table entry
    mainWeapons.forEach(weaponEntry => {
        weaponEntry.addEventListener('click', weaponClickHandler, true);
        mainWeaponsTable.appendChild(weaponEntry);
    });

    specialWeapons.forEach(weaponEntry => {
        weaponEntry.addEventListener('click', weaponClickHandler, true);
        specialWeaponsTable.appendChild(weaponEntry);
    });
}

const submitComment = (e: Event) => {
    const commentText = (document.querySelector("#comment-text") as HTMLInputElement)?.value;
    const commentAuthor = (document.querySelector("#add-comment-author") as HTMLInputElement)?.value;
    const date = Date.now();
    const comment: Comment = {
        author: commentAuthor || "Anonymous",
        text: commentText ?? "",
        date
    }
    axios.post('/add_comment', {
        comment
    });
    e.preventDefault();
    location.reload();
}

const loadComments = (response: AxiosResponse) => {

    if (commentsSection) {
        commentsSection.innerHTML = "";
        comments = response.data as Comment[];
        comments.forEach(comment => {
            commentsSection.appendChild(commentEntry(comment));
        });
    }
}

/**
 * Make buttons go brrrrr
 */

const setupUI = () => {
    const nextStatButton = document.querySelector("#next-stat");
    const prevStatButton = document.querySelector("#previous-stat");

    nextStatButton?.addEventListener('click', nextStatClickHandler);
    prevStatButton?.addEventListener('click', prevStatClickHandler);


    // comments
    const submitCommentBtn = document.querySelector("#comment-form");
    submitCommentBtn?.addEventListener('submit', submitComment);
}

/**
 * asynchronously load and cache all resources
 */
const loadResources = async () => {

    await axios.get("/api/weapons", { responseType: 'json' }).then(loadWeaponsTable);
    await axios.get("/api/main_weapon_stats", { responseType: 'json' }).then(loadStats(mainWeaponStats));
    await axios.get("/api/special_weapon_stats", { responseType: 'json' }).then(loadStats(specialWeaponStats));
    await axios.get("/api/enemy_stats", { responseType: 'json' }).then(loadStats(enemyStats));
    loadWeaponStatsSlide();

    await axios.get("/comments", { responseType: 'json' }).then(loadComments);

    console.log(mainWeaponStats);
    console.log(specialWeaponStats);
    console.log(enemyStats);
    console.log(comments);
}

loadResources().then(setupUI);
