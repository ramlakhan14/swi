import ManageEmailaContent from "../components/ManageEmailaContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const ManageEmailayout = withTwoColumnLayout(ManageEmailaContent, RightContent);

export default ManageEmailayout;
