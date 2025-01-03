const attributes = {};

class Context {
    set(rawKey, value) {
        const key = String(rawKey);
        if (!key || value === undefined) return;
        attributes[key] = value;
    }

    get(key) {
        if (!key) return attributes;
        if (Object.prototype.hasOwnProperty.call(attributes, key))
            return attributes[key];
        return undefined;
    }
}

module.exports = Context;

