// テスト対象のコンポーネントをインポート
import { StudyRecord } from "@/domain/studyRecord";
import App from "../App";
import { screen, waitFor } from "@testing-library/react";
import { render } from "./test-utils";

//テスト内容
// ローディング画面をみることができる
// テーブルをみることができる(リスト)
// テーブルのカラムの1つ目が「学習内容」
// テーブルカラムの2つ目が「学習時間」
// 新規登録ボタンがある
// タイトルがあること
// 登録できること
// モーダルが新規登録というタイトルになっている
// 学習内容がないときに登録するとエラーがでる
// 学習時間がないときに登録するとエラーがでる
// 未入力のエラー
// 0以上でないときのエラー
// 削除ができること
// ここでsupabaseと通信があるところは、モックをいれて実装すること
// Supabaseへのリクエストをモック（実際のAPIを呼ばせない）
const mockGetAllStudyRecords = jest
  .fn()
  .mockResolvedValue([
    new StudyRecord("1", "title1", 1, "2025-01-01"),
    new StudyRecord("2", "title2", 1, "2025-01-02"),
    new StudyRecord("3", "title3", 1, "2025-01-03"),
    new StudyRecord("4", "title4", 1, "2025-01-04"),
  ]);

jest.mock("../lib/studyRecords", () => {
  return {
    getAllStudyRecords: () => mockGetAllStudyRecords(),
  };
});

// describe: テストをグループ化する
describe("App", () => {
  // test: 個別のテストケースを定義する
  test("タイトルがあること", async () => {
    // Appコンポーネントをレンダリング
    render(<App />);
    await waitFor(() => screen.getByTestId("table"));
    const title = screen.getByTestId("title");
    expect(title).toBeInTheDocument();
  });
});
