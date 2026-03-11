// テスト対象のコンポーネントをインポート
import App from "../App";
// render: コンポーネントを仮想DOMにレンダリングする
// screen: レンダリングされた画面の要素を取得する
import { render, screen } from "@testing-library/react";

// describe: テストをグループ化する
describe("App", () => {
  // test: 個別のテストケースを定義する
  test("タイトルがあること", () => {
    // Appコンポーネントをレンダリング
    render(<App />);
    // "Hello World" というテキストがDOM上に存在することを確認
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
