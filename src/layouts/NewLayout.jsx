import NewsContent from "../components/NewsContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const NewLayout = withTwoColumnLayout(NewsContent, RightContent);

export default NewLayout;
