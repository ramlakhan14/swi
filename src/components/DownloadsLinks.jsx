import { useState } from 'react';
import { IcLink } from "../assets/icons/IcLink";
import { IcNoFile } from '../assets/icons/IcNofile';
import { IcPdf } from '../assets/icons/IcPdf';

const DownloadsLinks = ({ title = "", links = [] }) => {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };
    return (
        <div className="downloads-div mb-3">
            <div className='formHeadingWrapper-flex'>
                <p className='formHeading-flex'>{title}</p>
                <div className='line'></div>
            </div>
            <div className='quickLinks'>
                <ul className='list-unstyled quickLinkList mb-0'>
                    {links.map((link) => (
                        <li key={link.id} onClick={() => {
                            if (link?.url !== undefined) {
                                const target = link?.category_name === "SWI Outlet" ? "_blank" : "_self";
                                window.open(link.url, target);
                            }
                        }}>
                            <span
                                className="quickLinkItems"
                                onClick={() => toggleCategory(link.id)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: expandedCategory === link.id ? '#EFFEF4' : '',
                                    color: expandedCategory === link.id ? '#11843A' : ''
                                }}
                            >
                                <IcLink />
                                <span className='ms-3'>{link.category_name}</span>
                            </span>

                            {/* Show files when category is expanded */}
                            {expandedCategory === link.id && link?.files?.length > 0 && (
                                <ul className='list-unstyled mt-2'>
                                    {link.files.map((file) => (
                                        <li key={file.id} className='sub-li-text'>
                                            <a
                                                href={file.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className='text-decoration-none sub-Links'
                                            >
                                                <IcPdf />
                                                <span className='ms-2'>{file.title}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Show message when no files */}
                            {expandedCategory === link?.id && link?.files?.length === 0 && (
                                <p className='mb-0 sub-li-text mt-2'>
                                    <IcNoFile />
                                    <span className='ms-2'>No files available</span>
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DownloadsLinks;