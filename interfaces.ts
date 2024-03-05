interface SingleStat {
    [key: string]: string | number | boolean | object;
}

interface Stats {
    [key: string]: SingleStat;
}


interface WeaponIndex {
    [key: string]: {
        name: string;
        value: number;
    }
}

interface Comment {
    author: string;
    text: string;
    date: number;
}

export { SingleStat, Stats, WeaponIndex, Comment }