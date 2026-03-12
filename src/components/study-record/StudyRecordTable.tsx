import React, { memo } from "react";
import { Table, IconButton } from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { StudyRecord } from "@/domain/studyRecord";

type Props = {
  studyRecords: StudyRecord[];
};

export const StudyRecordTable = memo(({ studyRecords }: Props) => {
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
                >
                  <FiTrash2 />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
});
