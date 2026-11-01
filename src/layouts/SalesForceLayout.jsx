import RightContent from "../components/RightContent";
import SalesForceContent from "../components/SalesForceContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const SalesForceLayout = withTwoColumnLayout(SalesForceContent, RightContent);

export default SalesForceLayout;
