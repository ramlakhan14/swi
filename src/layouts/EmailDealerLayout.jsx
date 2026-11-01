import EmailDealerContent from "../components/EmailDealerContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const EmailDealerLayout = withTwoColumnLayout(EmailDealerContent, RightContent);

export default EmailDealerLayout;
