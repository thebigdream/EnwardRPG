// Sanitise the output to avoid common grammatical issues
export function sanitise(str) {
    try {
        // Remove opening space, if present
        if (str.charAt(0) == ' ') str = str.slice(1)

        // Replace double and triple spaces with a single space
        str = str.replace(/ {2,}/g, ' ');

        // Replace first letter of string with uppercase
        str = str.replace(/^\S/, (match) => match.toUpperCase());

        // Capitalize the first letter of each sentence
        str = str.replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase());

        // Capitalize any 'i' that is on its own
        str = str.replace(/\si\s/g, ' I ');

        // Replace multiple exclamation or question marks with a single one
        str = str.replace(/([!?])\1+/g, "$1");

        // Add space after commas if one not already existent
        str = str.replace(/([^ ,])(,)([^ ])/g, '$1, $3');

        // Remove any underscores
        str = str.replace(/_/g, "");

        // Remove any emotes
        str = str.replace(/<[^>]+>/g, "");

        // Remove impersonate
        str = str.replace(/\([^:]*:\s/g, '');

        // Remove ` characters
        str = str.replace( /`/g, "");

        // Replace b with brachoin
        str = str.replace(/ḇ/g, ' brahcoin');

        // Replace n-word with Enward
        str = str.replace(/nigger/g, 'Enward');

        // Replace n-word with Enward
        str = str.replace(/nigga/g, 'Enward');

        // Replace f-slur with Frogurt
        str = str.replace(/faggot/g, 'Frogurt');

        // Replace f-slur
        str = str.replace(/fag/g, 'French');

        // Replace pedo with Pedro
        str = str.replace(/pedo/g, 'Pedro');

        // Replace pedo with Pedro
        str = str.replace(/retard/g, 'RAM RANCH');

    } catch { 'Failed to sanitise' }
    return str
}