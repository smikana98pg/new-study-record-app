// テスト対象のコンポーネントをインポート
import { StudyRecord } from "@/domain/studyRecord";
import App from "../App";
import { screen, waitFor } from "@testing-library/react";
import { render } from "./test-utils";
import { userEvent } from "@testing-library/user-event";

// モック関数の作成
const mockGetAllStudyRecords = jest
  .fn()
  .mockResolvedValue([
    new StudyRecord("1", "title1", 1, "2025-01-01"),
    new StudyRecord("2", "title2", 1, "2025-01-02"),
    new StudyRecord("3", "title3", 1, "2025-01-03"),
    new StudyRecord("4", "title4", 1, "2025-01-04"),
  ]);
const mockInsertStudyRecord = jest.fn().mockResolvedValue(undefined);
const mockDeleteStudyRecord = jest.fn().mockResolvedValue(undefined);

// 本物の関数をモック関数に差し替える
jest.mock("../lib/studyRecords", () => {
  return {
    getAllStudyRecords: () => mockGetAllStudyRecords(),
    insertStudyRecord: (...args: unknown[]) => mockInsertStudyRecord(...args),
    deleteStudyRecord: (...args: unknown[]) => mockDeleteStudyRecord(...args),
  };
});

// 各テストの前にモックをリセット
beforeEach(() => {
  jest.clearAllMocks();
  mockGetAllStudyRecords.mockResolvedValue([
    new StudyRecord("1", "title1", 1, "2025-01-01"),
    new StudyRecord("2", "title2", 2, "2025-01-02"),
    new StudyRecord("3", "title3", 3, "2025-01-03"),
    new StudyRecord("4", "title4", 4, "2025-01-04"),
  ]);
});

// テーブルが表示されるまで待つヘルパー関数
const waitForTableToLoad = async () => {
  await waitFor(() => screen.getByTestId("table"));
};

// describe: テストをグループ化する
describe("App", () => {
  // ========== 表示系テスト ==========
  test("ローディング画面をみることができる", () => {
    render(<App />);
    // データ取得中はローディングが表示される
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("タイトルがあること", async () => {
    // Appコンポーネントをレンダリング
    render(<App />);
    await waitForTableToLoad();
    const title = screen.getByTestId("title");
    expect(title).toBeInTheDocument();
  });
  test("テーブルをみることができる", async () => {
    render(<App />);
    await waitForTableToLoad();
    const table = screen.getByTestId("table");
    expect(table).toBeInTheDocument();
  });

  test("テーブルのカラムの1つ目が「学習内容」", async () => {
    render(<App />);
    await waitForTableToLoad();
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("学習内容");
  });

  test("テーブルカラムの2つ目が「学習時間」", async () => {
    render(<App />);
    await waitForTableToLoad();
    const headers = screen.getAllByRole("columnheader");
    expect(headers[1]).toHaveTextContent("学習時間");
  });

  test("新規登録ボタンがある", async () => {
    render(<App />);
    await waitForTableToLoad();
    expect(screen.getByText("新規登録")).toBeInTheDocument();
  });

  // ========== モーダル表示テスト ==========
  test("モーダルが新規登録というタイトルになっている", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForTableToLoad();

    // 新規登録ボタンをクリック
    await user.click(screen.getByText("新規登録"));

    // モーダルのタイトルを確認
    await waitFor(() => {
      expect(screen.getByTestId("modal-title")).toHaveTextContent("新規登録");
    });
  });

  // ========== バリデーションテスト ==========
  test("学習内容がないときに登録するとエラーがでる", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForTableToLoad();

    // 新規登録ボタンをクリック
    await user.click(screen.getByText("新規登録"));

    // 学習内容を空のまま登録ボタンをクリック
    await user.click(screen.getByText("登録"));

    // エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText("学習内容の入力は必須です")).toBeInTheDocument();
    });
  });

  test("学習時間が0以下のときにエラーがでる", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForTableToLoad();

    // 新規登録ボタンをクリック
    await user.click(screen.getByText("新規登録"));

    // 学習内容を入力
    await user.type(screen.getByRole("textbox"), "React勉強");

    // 学習時間を入力
    const timeInput = screen.getByRole("spinbutton");
    await user.clear(timeInput);
    await user.type(timeInput, "0");

    // 登録ボタンをクリック
    await user.click(screen.getByText("登録"));

    // エラーメッセージが表示される
    await waitFor(() => {
      expect(
        screen.getByText("学習時間は1以上である必要があります"),
      ).toBeInTheDocument();
    });
  });

  // ========== 登録テスト ==========
  test("登録できること", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForTableToLoad();

    // 新規登録ボタンをクリック
    await user.click(screen.getByText("新規登録"));

    // 学習内容を入力
    await user.type(screen.getByRole("textbox"), "React勉強");

    // 学習時間を入力
    const timeInput = screen.getByRole("spinbutton");
    await user.clear(timeInput);
    await user.type(timeInput, "3");

    // 登録ボタンをクリック
    await user.click(screen.getByText("登録"));

    // insertStudyRecordが正しい引数で呼ばれたことを確認
    await waitFor(() => {
      expect(mockInsertStudyRecord).toHaveBeenCalledWith("React勉強", 3);
    });
  });

  // ========== 削除テスト ==========
  test("削除ができること", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitForTableToLoad();

    // 削除ボタン（1つ目）をクリック
    const deleteButtons = screen.getAllByLabelText("削除");
    await user.click(deleteButtons[0]);

    // deleteStudyRecordが呼ばれたことを確認
    await waitFor(() => {
      expect(mockDeleteStudyRecord).toHaveBeenCalledWith("1");
    });
  });
});
