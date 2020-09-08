module.exports = {
    roots: ["<rootDir>/__tests__"],
    testPathIgnorePatterns: [
        "<rootDir>/__tests__/__mocks__"
    ],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    coverageThreshold: {
        global: {
            lines: 80
        }
    }
};