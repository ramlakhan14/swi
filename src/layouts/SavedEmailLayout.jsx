import RightContent from "../components/RightContent";
import SavedEmailContent from "../components/SavedEmailContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const SavedEmailLayout = withTwoColumnLayout(SavedEmailContent, RightContent);

export default SavedEmailLayout;
