import React, { useState, useEffect } from "react";
import { ChevronLeft } from "../assets/icons/ChevronLeft";
import { ChevronRight } from "../assets/icons/ChevronRight";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const [inputValue, setInputValue] = useState(currentPage.toString());

    useEffect(() => {
        setInputValue(currentPage.toString());
    }, [currentPage]);

    const handleInputChange = (e) => {
        const value = e.target.value;

        // Allow empty so backspace works
        if (value === "") {
            setInputValue("");
            return;
        }

        // Allow only numbers
        if (!/^\d+$/.test(value)) return;

        const pageNum = Number(value);

        // Update only if within valid range
        if (pageNum >= 1 && pageNum <= totalPages) {
            setInputValue(value);
            onPageChange(pageNum);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="d-flex align-items-center pagination-text mt-2" style={{
            gap: "12px", WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none"
        }}>
            <span
                onClick={handlePrevious}
                role="button"
                style={{
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1
                }}
            >
                <ChevronLeft />
            </span>

            <div className="d-flex align-items-center" style={{ gap: "10.5px" }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form-control text-center pagination-input-box"
                />
                <span>of</span>
                <span style={{ fontWeight: "500" }}>{totalPages}</span>
            </div>

            <span
                onClick={currentPage === totalPages ? undefined : handleNext}
                role="button"
                style={{
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.5 : 1
                }}
            >
                <ChevronRight />
            </span>


        </div>
    );
};

export default PaginationComponent;
