import { memo, useState } from "react";
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
import { insertStudyRecord } from "@/lib/studyRecords";
import { useForm } from "react-hook-form";

// プロップスの型定義
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onModalAddClicked: () => void;
};

// フォームの型定義
type FormData = {
  studyTitle: string;
  studyTime: number;
};

export const StudyRecordModal: React.FC<Props> = memo((props) => {
  const { open, setOpen, onModalAddClicked } = props;
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

  //登録ボタン押下時
  const onClickAdd = async (data: FormData) => {
    setIsLoading(true);
    try {
      // DBに登録
      await insertStudyRecord(data.studyTitle, data.studyTime);
      //登録ボタン押下後のコールバック関数
      onModalAddClicked();
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
              <DialogTitle>学習記録</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Fieldset.Root size="lg">
                <Fieldset.Content>
                  <Field.Root>
                    <Field.Label>学習内容</Field.Label>
                    <Input
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
                  onClick={handleSubmit(onClickAdd)}
                  loading={isLoading}
                  loadingText="登録中..."
                >
                  登録
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
