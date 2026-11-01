import DownloadDealerListContent from "../components/DownloadDealerListContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const DownloadDealerListLayout = withTwoColumnLayout(DownloadDealerListContent, RightContent);

export default DownloadDealerListLayout;
