import React, { useState } from 'react';
import eyeIcon from "../assets/icons/ic-eye.png";
import pencilIcon from "../assets/icons/ic-pencil.png";
import trashIcon from "../assets/icons/ic-trash-black.png";
import { formatToMMDDYYYYhhmmA } from '../utils/dateService';
const DataTable = ({
    columns,
    data,
    showCheckbox = true,
    onView,
    onEdit,
    onDelete,
    onSelectAll,
    onSelectRow,
    actionMinWidth = true,
    selectedRows = []
}) => {

    function escapeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    return (
        <div className='table-responsive overflow-auto mt-2' style={{
            maxHeight: "350px",
            border: "1px solid #E4E4E7",
            borderRadius: "12px",
        }}>
            <table
                className="w-100 mt-0 border-0"
            >
                <thead style={{
                    backgroundColor: "#F4F4F5",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                }}>
                    <tr>
                        {showCheckbox && (
                            <th scope="col" style={{ padding: "6px 8px", minWidth: "40px" }}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedRows.length === data.length && data.length > 0}
                                    onChange={(e) => onSelectAll?.(e.target.checked)}
                                />
                            </th>
                        )}
                        {columns?.map((col, idx) => (
                            <th
                                key={idx}
                                scope="col"
                                style={{
                                    padding: "8px 16px",
                                    minWidth: col.minWidth || "120px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    textTransform: "uppercase",
                                }}
                            >
                                {col.header}
                            </th>
                        ))}
                        <th scope="col" style={{
                            minWidth: onView ? actionMinWidth ? "120px" : "72px" : onEdit ? "72px" : "100px", padding: "8px 16px", fontWeight: "600",
                            fontSize: "12px",
                        }}>
                            ACTION
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length === 0 ? <tr style={{ borderTop: "1px solid #E4E4E7" }}>
                        <td
                            className={"non-title-td text-center"}
                            style={{ fontWeight: "400" }}
                            colSpan={columns?.length + 2}
                        >There is no data</td>
                    </tr> : data?.map((row, rowIdx) => (
                        <tr key={rowIdx} style={{ borderTop: "1px solid #E4E4E7" }}>
                            {showCheckbox && (
                                <td style={{ padding: "6px 8px", verticalAlign: "top", borderBottom: "1px solid #F4F4F5" }}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedRows.includes(row.id || rowIdx)}
                                        onChange={(e) => onSelectRow?.(row.id || rowIdx, e.target.checked)}
                                    />
                                </td>
                            )}
                            {columns.map((col, colIdx) => (
                                <td
                                    key={colIdx}
                                    className={col.header === "Title" ? "title-td" : "non-title-td"}
                                    style={{
                                        fontWeight:
                                            col.header === "Dealer #" || col.header === "Subject" ? "600" : "400",
                                    }}
                                >
                                    {(col.header === "Title" || col.header === "FIRST NAME") && (
                                        <span className={row["status"] ? "active-dot" : "in-active-dot"}></span>
                                    )}

                                    {col.header === "status" && (
                                        <span style={{
                                            display: "inline-block",
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            marginRight: "6px",
                                            backgroundColor:
                                                row[col.field] === "1" ? "#12BC4E" :
                                                    row[col.field] === "0" ? "#FFCC00" :
                                                        row[col.field] === "2" ? "#FF4245" :
                                                            "#9ca3af",
                                            verticalAlign: "middle",
                                        }}></span>
                                    )}
                                    {col.header === "status" && (
                                        <span>
                                            {row[col.field] === "1" ? "Approved" :
                                                row[col.field] === "2" ? "Rejected" :
                                                    row[col.field] === "0" ? "Pending" : "-"}
                                        </span>
                                    )}
                                    {col.header !== "status" && (
                                        col.header === "Last Modified"
                                            ? formatToMMDDYYYYhhmmA(row[col.field])
                                            : col.render
                                                ? col.render(row)
                                                : (
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: escapeHTML(row[col.field]),
                                                        }}
                                                    />
                                                )
                                    )}
                                </td>
                            ))}
                            <td style={{ padding: "8px 16px", verticalAlign: "top", borderBottom: "1px solid #F4F4F5" }}>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    {onView && (
                                        <button
                                            onClick={() => onView(row)}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                        >
                                            <img src={eyeIcon} alt='eye Icon' width={"24px"} height={"24px"} loading="lazy" />
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(row)}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                        >
                                            <img src={pencilIcon} alt='pencil Icon' width={"24px"} height={"24px"} loading="lazy" />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(row)}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                        >
                                            <img src={trashIcon} alt='trash Icon' width={"24px"} height={"24px"} loading="lazy" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;