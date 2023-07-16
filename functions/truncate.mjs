// Truncate a message to a randomly defined amount of sentences
import random  from 'random';
export function truncate(str, min, max) {
    try {
        var count = 0
        var limit = [random.int(min,max)]
        for(var i = 0; i < str.length; i++) {
            if (str.charAt(i) == '.' || str.charAt(i) == '!' || str.charAt(i) == '?') count++
            if (count == limit) return str.slice(0, i+1)
        }
    } catch { console.log('Failed to truncate message.') }
    return str;
}