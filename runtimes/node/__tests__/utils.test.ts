import { getAllFilesInDir, isDirExists } from "../src/utils";
import * as path from "path";

describe("Utils", () => {
    describe("getAllFilesInDir", () => {
        it("should get all files in folder", () => {
            const files = getAllFilesInDir(
                path.resolve(__dirname, "../../../.github/ISSUE_TEMPLATE"), "/**/*.md"
            );

            expect(files.length).toBe(2);
        });
    });

    describe("isDirExists", () => {
        it("should return true if a directory exists", () => {
            expect(
                isDirExists(path.resolve(__dirname, "./__mocks__"))
            ).toBe(true);
        });

        it("should return false if a directory NOT exists", () => {
            expect(
                isDirExists("./some_fake_path")
            ).toBe(false);
        })
    });
});