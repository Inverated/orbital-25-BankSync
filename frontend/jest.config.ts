import { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.jest.json",
            }
        ],
    }
}

export default config;