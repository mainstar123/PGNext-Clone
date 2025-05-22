import { FunctionComponent } from "react";
import { Button } from "react-bootstrap";
import styles from "../../../styles/PlayerHighlights.module.scss";

interface CustomBSSmallButtonProps {
  buttonText: string;
  //   onCLick?: () => void;
}

const CustomBSSmallButton: FunctionComponent<CustomBSSmallButtonProps> = ({
  buttonText,
}) => {
  return (
    <Button
      variant="light"
      size="sm"
      className={`default-font-size ${styles["report-problem-btn"]}`}
    >
      {buttonText}
    </Button>
  );
};

export default CustomBSSmallButton;
