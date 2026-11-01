const MarqueeSection = ({ isAlertData }) => {
    function escapeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    const handleMouseEnter = (e) => {
        e.currentTarget.stop();
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.start();
    };

    return (
       <>
       {isAlertData && 
         <div className='container-fluid'>
            <div className='container'>
                <marquee 
                    className="marquee-text-div" 
                    direction="left" 
                    loop="infinite"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: escapeHTML(isAlertData),
                        }}
                    />
                </marquee>
            </div>
        </div>
       }
       </>
    );
};
export default MarqueeSection;