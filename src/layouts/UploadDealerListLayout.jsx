import RightContent from "../components/RightContent";
import UploadDealerListContent from "../components/UploadDealerListContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const UploadDealerListLayout = withTwoColumnLayout(UploadDealerListContent, RightContent);

export default UploadDealerListLayout;
