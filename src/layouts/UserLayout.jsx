import RightContent from "../components/RightContent";
import UserContent from "../components/UserContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const UserLayout = withTwoColumnLayout(UserContent, RightContent);

export default UserLayout;
