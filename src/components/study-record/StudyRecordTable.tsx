import { memo, useState } from "react";
import { Table, IconButton, Spinner, Box, Center } from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { StudyRecord } from "@/domain/studyRecord";
import { deleteStudyRecord } from "@/lib/studyRecords";

type Props = {
  studyRecords: StudyRecord[];
  onDeleteClicked: () => void;
};

export const StudyRecordTable = memo(
  ({ studyRecords, onDeleteClicked }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    //削除ボタン押下時
    const onClickDelete = async (id: string) => {
      setIsLoading(true);
      try {
        // DBから削除
        await deleteStudyRecord(id);
        // 削除ボタン押下後のコールバック関数
        onDeleteClicked();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <>
        <Table.Root size="sm" data-testid="table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>学習内容</Table.ColumnHeader>
              <Table.ColumnHeader>学習時間</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {studyRecords.map((studyRecord) => (
              <Table.Row key={studyRecord.id}>
                <Table.Cell>{studyRecord.title}</Table.Cell>
                <Table.Cell>{studyRecord.time}</Table.Cell>
                <Table.Cell textAlign="end">
                  <IconButton aria-label="編集" colorPalette="teal" size="sm">
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    aria-label="削除"
                    colorPalette="red"
                    size="sm"
                    ml={2}
                    onClick={() => onClickDelete(studyRecord.id)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          {isLoading && (
            <Box pos="absolute" inset="0" bg="bg/80">
              <Center h="full">
                <Spinner color="teal.500" />
              </Center>
            </Box>
          )}
        </Table.Root>
      </>
    );
  },
);
