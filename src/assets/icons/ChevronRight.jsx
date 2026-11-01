import React, { HTMLAttributes } from "react";

export const ChevronRight = ({
    width = 16,
    height = 16,
    fill = "black",
    ...restProps
}) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="#9F9FA9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
