import ClaimFormDataDownloadContent from "../components/ClaimFormDataDownloadContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const ClaimFormDataDownloadLayout = withTwoColumnLayout(ClaimFormDataDownloadContent, RightContent);

export default ClaimFormDataDownloadLayout;
