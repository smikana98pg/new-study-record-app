import { memo } from "react";
import type { ReactNode } from "react";
import { Button } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export const PrimaryButton = memo(({ children, onClick }: Props) => {
  return (
    <Button
      colorPalette="blue"
      fontSize="md"
      onClick={onClick}
      _hover={{ opacity: 0.8 }}
    >
      {children}
    </Button>
  );
});
