import "@testing-library/jest-dom";
// .envファイルの環境変数を読み込む
import { config } from "dotenv";

// dotenvで.envファイルを読み込む。quiet: trueでログ出力を抑制する
config({ quiet: true });

if (typeof structuredClone === "undefined") {
  global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
