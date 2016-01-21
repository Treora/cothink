assert = function (cond, message) {
    if (!cond) {
        message = message || "Assertion failed.";
        throw new Error(message);
    }
}

assert_type = function (object, prototype) {
    message = "Object " + object + " is not of type " + prototype + ".";
    assert(prototype.isPrototypeOf(object), message);
}
