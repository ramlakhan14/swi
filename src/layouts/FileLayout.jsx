import FileContent from "../components/FileContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const FileLayout = withTwoColumnLayout(FileContent, RightContent);

export default FileLayout;
    