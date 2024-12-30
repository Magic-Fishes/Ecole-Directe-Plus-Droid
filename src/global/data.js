let attributes = {};

class Context {
    set(rawKey, value) {
        const key = String(rawKey);
        if (!key || value === undefined) {
            return;
        }
        attributes[key] = value;
        console.log(`Update ${rawKey}`);
        // console.log(attributes);
    }

    get(key) {
        // console.log(key);
        // console.log(attributes);
        if (!key) {
            return attributes;
        }
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            return attributes[key];
        }
        return undefined;
    }
}

module.exports = Context;
