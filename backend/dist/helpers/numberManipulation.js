"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
function clamp(num, min, max) {
    return num <= min
        ? min
        : num >= max
            ? max
            : num;
}
//# sourceMappingURL=numberManipulation.js.map