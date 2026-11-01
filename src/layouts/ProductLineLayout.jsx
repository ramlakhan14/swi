import ProductLineContent from "../components/ProductLineContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const ProductLineLayout = withTwoColumnLayout(ProductLineContent, RightContent);

export default ProductLineLayout;
