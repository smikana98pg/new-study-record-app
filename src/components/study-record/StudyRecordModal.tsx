import { memo, useEffect, useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Field,
  Fieldset,
  Input,
  Portal,
} from "@chakra-ui/react";
import { insertStudyRecord, updateStudyRecord } from "@/lib/studyRecords";
import { useForm } from "react-hook-form";
import type { StudyRecord } from "@/domain/studyRecord";

// プロップスの型定義
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onModalSubmitted: () => void;
  editRecord: StudyRecord | null; // nullなら新規、あれば編集
};

// フォームの型定義
type FormData = {
  studyTitle: string;
  studyTime: number;
};

export const StudyRecordModal: React.FC<Props> = memo((props) => {
  const { open, setOpen, onModalSubmitted, editRecord } = props;
  const [isLoading, setIsLoading] = useState(false);
  const {
    register, // 入力フィールドを登録する関数
    handleSubmit, // バリデーション通過後に実行する関数
    reset, // フォームをリセットする関数
    formState: { errors }, // バリデーションエラー情報
  } = useForm<FormData>({
    defaultValues: {
      studyTitle: "",
      studyTime: 0,
    },
  });

  // editRecordが変わったらフォームに値をセット
  useEffect(() => {
    if (editRecord) {
      // 編集モード：既存のデータをフォームにセット
      reset({
        studyTitle: editRecord.title,
        studyTime: editRecord.time,
      });
    } else {
      // 新規モード：空にリセット
      reset({
        studyTitle: "",
        studyTime: 0,
      });
    }
  }, [editRecord, reset]);

  // 登録処理（新規 or 更新を分岐）
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (editRecord) {
        // DB更新
        await updateStudyRecord(editRecord.id, data.studyTitle, data.studyTime);
      } else {
        // DB登録
        await insertStudyRecord(data.studyTitle, data.studyTime);
        //登録ボタン押下後のコールバック関数
      }
      onModalSubmitted();
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //モーダルオープン時イベント
  const onOpenChange = (e: { open: boolean }) => {
    setOpen(e.open);
    // モーダルが閉じたらリセット
    if (!e.open) {
      reset();
    }
  };

  return (
    <DialogRoot lazyMount open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle data-testid="modal-title">
                {editRecord ? "記録編集" : "新規登録"}
              </DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Fieldset.Root size="lg">
                <Fieldset.Content>
                  <Field.Root>
                    <Field.Label>学習内容</Field.Label>
                    <Input
                      type="text"
                      {...register("studyTitle", {
                        required: "学習内容の入力は必須です",
                      })}
                    />
                    {errors.studyTitle && (
                      <Box color="red.500" fontSize="sm">
                        {errors.studyTitle.message}
                      </Box>
                    )}
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>学習時間</Field.Label>
                    <Input
                      type="number"
                      onFocus={(e) => e.target.select()}
                      {...register("studyTime", {
                        required: "学習時間の入力は必須です",
                        min: {
                          value: 1,
                          message: "学習時間は1以上である必要があります",
                        },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.studyTime && (
                      <Box color="red.500" fontSize="sm">
                        {errors.studyTime.message}
                      </Box>
                    )}
                  </Field.Root>
                </Fieldset.Content>

                <Button
                  alignSelf="flex-start"
                  onClick={handleSubmit(onSubmit)}
                  loading={isLoading}
                  loadingText={editRecord ? "更新中..." : "登録中..."}
                >
                  {editRecord ? "保存" : "登録"}
                </Button>
              </Fieldset.Root>
            </DialogBody>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </DialogContent>
        </Dialog.Positioner>
      </Portal>
    </DialogRoot>
  );
});
