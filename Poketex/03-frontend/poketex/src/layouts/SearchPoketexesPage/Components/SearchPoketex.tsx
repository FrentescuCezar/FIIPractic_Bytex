import PoketexModel from "../../../models/PoketexModel";

export const SearchPoketex: React.FC<{ poketex: PoketexModel }> = (props) => {

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        } else {
            return text;
        }
    }

    function formatTextWithNewlines(text: string) {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    }


    const MAX_LENGTH_DESCRIPTION = 800;
    const truncatedDescription = truncateText(props.poketex.description, MAX_LENGTH_DESCRIPTION);
    const formattedDescription = formatTextWithNewlines(truncatedDescription);


    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.poketex.image ?
                            <img src={`data:image/png;base64,${props.poketex.image}`}
                                width='200'
                                height='200'
                                alt='Pokemon'
                            />
                            :
                            <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123'
                                height='196'
                                alt='Pokemon'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center
                        align-items-center'>
                        {props.poketex.image ?
                            <img src={`data:image/png;base64,${props.poketex.image}`}
                                width='200'
                                height='200'
                                alt='Pokemon'
                            />
                            :
                            <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123'
                                height='196'
                                alt='Pokemon'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.poketex.username}
                        </h5>
                        <h4>
                            {props.poketex.name}
                        </h4>
                        <p className='card-txt'>
                            {formattedDescription}
                        </p>
                    </div>
                    <div className='col-md-4 d-flex justify-content-center align-items-center'>
                        <a className='btn btn-md main-color text-white' href='#'>
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}