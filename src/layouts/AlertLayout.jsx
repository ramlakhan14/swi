import AlertContent from "../components/AlertContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const AlertLayout = withTwoColumnLayout(AlertContent, RightContent);

export default AlertLayout;
