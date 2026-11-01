import RightContent from "../components/RightContent";
import VerificationFileUploadContent from "../components/VerificationFileUploadContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const VerificationFileUploadLayout = withTwoColumnLayout(VerificationFileUploadContent, RightContent);

export default VerificationFileUploadLayout;
