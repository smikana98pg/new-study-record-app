import { render } from "@testing-library/react";
import { Provider } from "../components/ui/provider";

const customRender = (ui: React.ReactElement) => {
  return render(
    <Provider>{ui}</Provider>
  );
};

export { customRender as render };