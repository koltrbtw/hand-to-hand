import { sha256 } from 'js-sha256';

// Случайная строка
export const generateRandom = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });    
};

// Генерация SHA256
export const encryptHash = function(message) {
    return sha256(message);
};

// Случайный SHA256
export const randomHash = function() {
    return encryptHash(generateRandom())
}