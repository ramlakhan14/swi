import ProductLineEditContent from "../components/ProductLineEditContent";
import RightContent from "../components/RightContent";
import withTwoColumnLayout from "../hoc/withTwoColumnLayout";


const ProductLineEditLayout = withTwoColumnLayout(ProductLineEditContent, RightContent);

export default ProductLineEditLayout;
