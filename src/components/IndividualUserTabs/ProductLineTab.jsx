import React from 'react';

const ProductLineTab = ({ register, errors , isProductLines}) => {
    return (
        <div>
            <hr style={{ borderColor: "#E4E4E7", margin: "16px 0", opacity: "1" }} />
            <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#18181B',
                textTransform:"uppercase"
            }}>
                Product Line:
            </label>
            <div className='row'>
                <div className='col-6'>
                    {isProductLines?.slice(0, Math.ceil(isProductLines.length / 2)).map((product) => (
                        <div key={product.id} className="form-check" style={{ marginBottom: '10px' }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`product_ids${product.id}`}
                                {...register(`product_${product.id}`)}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`product_ids${product.id}`}
                                style={{ fontSize: '14px', color: '#666' }}
                            >
                                {product.name}
                            </label>
                        </div>
                    ))}
                </div>
                <div className='col-6'>
                    {isProductLines?.slice(Math.ceil(isProductLines.length / 2)).map((product) => (
                        <div key={product.id} className="form-check" style={{ marginBottom: '10px' }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`product_ids${product.id}`}
                                {...register(`product_${product.id}`)}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`product_ids${product.id}`}
                                style={{ fontSize: '14px', color: '#666' }}
                            >
                                {product.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductLineTab;
