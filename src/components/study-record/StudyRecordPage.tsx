import { useEffect, useState } from "react";
import { Flex, Box, Spinner } from "@chakra-ui/react";
import type { StudyRecord } from "@/domain/studyRecord";
import { getAllStudyRecords } from "@/lib/studyRecords";
import { PageHeader } from "../PageHeader";
import { PrimaryButton } from "../ui/PrimaryButton";
import { StudyRecordTable } from "./StudyRecordTable";
import { StudyRecordModal } from "./StudyRecordModal";

export const StudyRecordPage = () => {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); // モーダル表示用ステート

  // DBからデータ取得処理
  const fetchStudyRecords = async () => {
    const studyRecords = await getAllStudyRecords();
    setStudyRecords(studyRecords);
    setIsLoading(false);
  };

  // 初回のみデータ取得
  useEffect(() => {
    let ignore = false;

    const fetch = async () => {
      const studyRecords = await getAllStudyRecords();
      if (!ignore) {
        setStudyRecords(studyRecords);
        setIsLoading(false);
      }
    };
    fetch();

    return () => {
      ignore = true;
    };
  }, []);

  // 新規登録ボタン押下時
  const onClickAdd = () => {
    setOpen(true);
  };

  // 登録後のコールバック
  const onModalAddClicked = () => {
    setOpen(false);
    fetchStudyRecords(); // 登録後に再取得
  };

  // 削除後のコールバック
  const onDeleteClicked = () => {
    fetchStudyRecords(); // 削除後に再取得
  };

  // データ取得中の場合
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <Flex justify="center" mt={10}>
        <Box w="lg">
          {/* タイトル表示 */}
          <PageHeader />

          {/* 新規登録ボタン表示 */}
          <Flex justify="flex-end" my={4}>
            <PrimaryButton onClick={onClickAdd}>新規登録</PrimaryButton>
          </Flex>

          {/* 一覧表示 */}
          <StudyRecordTable
            studyRecords={studyRecords}
            onDeleteClicked={onDeleteClicked}
          />
        </Box>
      </Flex>
      <StudyRecordModal
        open={open}
        setOpen={setOpen}
        onModalAddClicked={onModalAddClicked}
      />
    </>
  );
};
