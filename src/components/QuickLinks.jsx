import { Link } from "react-router-dom";
import { IcLink } from "../assets/icons/IcLink";

const QuickLinks = ({ title = "", links = [] }) => {    
    return (
        <div className="downloads-div mb-3">
            <div className='formHeadingWrapper-flex'>
                <p className='formHeading-flex'>{title}</p>
                <div className='line'></div>
            </div>
            <div className='quickLinks'>
                <ul className='list-unstyled quickLinkList mb-0'>
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link
                                className="quickLinkItems"
                                to={link.url}
                            >
                                <IcLink />
                                <span className='ms-3'>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default QuickLinks;