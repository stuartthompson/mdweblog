/**
 * Returns the remainder of a string after the first instance of a pattern.
 *
 * @param {string} s - The string to trim.
 * @param {string} p - The pattern to match.
 * @returns - Returns only the contents after the matched pattern.
 */
const after = (s, p) => {
    const result =
        s.substr(
            s.indexOf(p) + p.length,
            s.length - (s.indexOf(p) + p.length)
        );

    return result;
}

const formatDate = (date) => {
    let dt = new Date(date);
    let y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dt);
    let m = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(dt);
    let d = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dt);
    return `${y}-${m}-${d}`;
}

export { after, formatDate };

