const NewSection = ({ newsData }) => {
    return (
        <div className="news-div">
            <div className='formHeadingWrapper-flex'>
                <p className='formHeading-flex'>News</p>
                <div className='line'></div>
            </div>
            {newsData?.map((item, index) => (
                <div className="new-div" key={index}>
                    <h3 className="new-hadding">{item?.title}</h3>
                    <p className="new-paragraph">{item?.message}</p>
                </div>
            ))}
        </div>
    )
};

export default NewSection;