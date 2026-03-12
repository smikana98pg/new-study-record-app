import React, { memo } from "react";
import {
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

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const StudyRecordModal: React.FC<Props> = memo((props) => {
  const { open, setOpen } = props;
  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
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
                    <Input name="name" />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>学習時間</Field.Label>
                    <Input name="time" />
                  </Field.Root>
                </Fieldset.Content>

                <Button type="submit" alignSelf="flex-start">
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
