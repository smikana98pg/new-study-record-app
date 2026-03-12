import { useEffect, useState } from "react";
import { Flex, Box, Spinner } from "@chakra-ui/react";
import type { StudyRecord } from "@/domain/studyRecord";
import { getAllStudyRecords, insertStudyRecord } from "@/lib/studyRecords";
import { PageHeader } from "../PageHeader";
import { PrimaryButton } from "../ui/PrimaryButton";
import { StudyRecordTable } from "./StudyRecordTable";
import { StudyRecordModal } from "./StudyRecordModal";

export const StudyRecordPage = () => {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); // モーダル表示用ステート

  // DBからデータ取得処理
  useEffect(() => {
    const fetchStudyRecords = async () => {
      const studyRecords = await getAllStudyRecords();
      setStudyRecords(studyRecords);
      setIsLoading(false);
    };
    fetchStudyRecords();
  }, []);

  // 新規登録処理
  const onclickAdd = () => {
    setOpen(true);
  };

  //const onAdd = () => {
        // DBに登録 & uuidを取得
        //const insertedRecord = await insertStudyRecord(title, time);
  //}

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
            <PrimaryButton onClick={onclickAdd}>新規登録</PrimaryButton>
          </Flex>

          {/* 一覧表示 */}
          <StudyRecordTable studyRecords={studyRecords} />
        </Box>
      </Flex>
      <StudyRecordModal open={open} setOpen={setOpen} />
    </>
  );
};
