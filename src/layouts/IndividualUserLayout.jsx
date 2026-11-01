import IndividualUserContent from "../components/IndividualUserContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const IndividualUserLayout = withTwoColumnLayout(IndividualUserContent, RightContent);

export default IndividualUserLayout;
