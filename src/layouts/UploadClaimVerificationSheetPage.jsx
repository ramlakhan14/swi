import RightContent from "../components/RightContent";
import UploadClaimVerificationSheetContent from "../components/UploadClaimVerificationSheetContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const UploadClaimVerificationSheetLayout = withTwoColumnLayout(UploadClaimVerificationSheetContent, RightContent);

export default UploadClaimVerificationSheetLayout;
