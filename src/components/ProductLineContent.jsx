import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import AddProductLine from './Modal/AddProductLine';
import { showErrorToast } from '../utils/ToastUtils';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/ProductsApis';
import HelmetComponent from './HelmetComponent';

const ProductLineContent = () => {
    const navigate = useNavigate();
    const [isAddProductLine, setIsAddProductLine] = useState(false);
    const [isProudctData, setIsProudctData] = useState([]);

    const fetchGetAllNews = async () => {
        try {
            const response = await getAllProducts();
            setIsProudctData(response.data);
        } catch (error) {
            showErrorToast("An error occurred while fetching the product data. Please refresh and try again.");
        }
    }

    useEffect(() => {
        fetchGetAllNews();
    }, []);


    return (
        <>
            <HelmetComponent
                title="Product Line | SWI"
                description="This is the description for the product line page."
                keywords="react, helmet, seo"
                canonicalUrl=""
                customMeta={[
                    { name: "robots", content: "index, follow" },
                    { name: "author", content: "Ritik Jain" },
                    { property: "og:title", content: "My React App" }
                ]}
            />
            <InnerPageTopBar />
            <div className="name-part" style={{ marginTop: "20px" }}>
                <div className='d-flex justify-content-between'>
                    <h2>Product Line</h2>
                    <button
                        type="button"
                        className="btn btn-dark black-btn-hover-white"
                        onClick={() => setIsAddProductLine(true)}
                        style={{ fontSize: "12px", fontWeight: "700",padding:"12px 24px" }}
                    >Add New</button>
                </div>
                <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
            </div>
            <div className='d-flex flex-wrap overflow-auto' style={{ gap: '24px', maxHeight: "550px" }}>
                {isProudctData?.map((product) => (
                    <div key={product?.id} className='text-center product-container'>
                        <div className='product-div' onClick={() =>
                            navigate(`/product-line-edit-content/${product?.id}`)
                        }>
                            <img
                                src={product?.product_logo}
                                alt='company-icon'
                                className='product-Line-page-product-img'
                                width={"240px"}
                                height={"120px"}
                                loading="lazy"
                            />
                        </div>
                        <p className='product-Line-page-product-name'>
                            {product?.product_name}
                        </p>
                    </div>
                ))}

            </div>
            <AddProductLine isOpen={isAddProductLine} onClose={() => setIsAddProductLine(false)} fetchGetAllNews={fetchGetAllNews} />
        </>
    );
};

export default ProductLineContent;