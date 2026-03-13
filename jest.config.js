export default {
  // ts-jestのプリセットを使用する
  preset: "ts-jest",
  // テスト環境をjsdom（ブラウザ相当）にする。ReactのDOM操作をテストするために必要
  testEnvironment: "jsdom",
  // テスト実行前に読み込むセットアップファイルを指定
  setupFilesAfterEnv: ["./jest.setup.ts"],
  // テスト対象のファイルパターンを指定。__tests__フォルダ内の.spec.ts/.spec.tsxのみ対象にする
  testMatch: ["**/__tests__/**/*.spec.(ts|tsx)"],
  transform: {
    // .ts/.tsxファイルをts-jestで変換する
    // デフォルトではtsconfig.jsonが読み込まれるが、Viteプロジェクトではモジュール方式の違いでエラーが出るため
    // Jest専用のtsconfig.jest.jsonを指定する
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    // CSSファイルのimportをモック（代替）する。JestはCSSを解釈できないため、ダミーに置き換える
    "\\.(css|less)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
