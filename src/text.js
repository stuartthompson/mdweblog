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

export { after };

